/**
 * @file src/services/auth/auth.service.ts
 * @title Authentication Service Logic
 * @description Handles login, registration, JWT generation, and email flows.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import crypto from 'node:crypto'
import { config } from '@config/env.js'
import { log } from '@config/logger.js'
import type {
    CreateUserDto,
    IUserRepository,
} from '@db/users.repository.interface.js'
import type {
    LoginSchemaType,
    RegisterSchemaType,
} from '@schemas/auth.schema.js'
import type {
    AuthResponse,
    IAuthService,
    RefreshResponse,
} from '@services/auth/auth.service.interface.js'
import { AppError } from '@typings/errors/AppError.js'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { inject, injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import ms, { type StringValue } from 'ms'
import { TYPES } from '@/types/ioc.types.js'

// --- Constants ---
const MSG_INVALID_CREDENTIALS = 'Invalid email or password'
const MSG_REGISTRATION_FAILED = 'User registration failed'
const MSG_INVALID_REFRESH_TOKEN = 'Invalid refresh token'
const MSG_TOKEN_REUSE_DETECTED =
    'Security Alert: Refresh token reuse detected. All sessions revoked for user.'

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.UserRepository) private usersRepository: IUserRepository,
    ) {}

    /**
     * Generates a pair of Access and Refresh tokens.
     * Uses a UUID (jti) for the Refresh Token to allow bcrypt hashing in DB.
     */
    private async generateAuthTokens(userId: string) {
        const now = Date.now()
        const accessDuration = ms(config.jwtAccessExpiresIn as StringValue)
        const refreshDuration = ms(config.jwtRefreshExpiresIn as StringValue)

        // Expiration dates
        const refreshExpiresAt = new Date(now + refreshDuration)

        // Generate a unique ID for the refresh token (JTI)
        const refreshTokenId = crypto.randomUUID()

        // Payloads
        const accessTokenPayload = {
            exp: Math.floor((now + accessDuration) / 1000),
            id: userId,
        }

        // We embed the token ID (jti) in the payload to find it later in DB
        const refreshTokenPayload = {
            exp: Math.floor(refreshExpiresAt.getTime() / 1000),
            id: userId,
            jti: refreshTokenId,
        }

        const accessToken = jwt.sign(accessTokenPayload, config.jwtAccessSecret)
        const refreshToken = jwt.sign(
            refreshTokenPayload,
            config.jwtRefreshSecret,
        )

        // Securely hash the token for storage using bcrypt
        const tokenHash = await bcrypt.hash(
            refreshToken,
            config.bcryptSaltRounds,
        )

        // Persist with the specific ID
        await this.usersRepository.createRefreshToken(
            refreshTokenId,
            userId,
            tokenHash,
            refreshExpiresAt,
        )

        return { accessToken, refreshToken }
    }

    /**
     * Authenticates a user.
     */
    async login(credentials: LoginSchemaType): Promise<AuthResponse> {
        const { email, password } = credentials
        const user = await this.usersRepository.findUserByEmail(email)

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError(
                MSG_INVALID_CREDENTIALS,
                StatusCodes.UNAUTHORIZED,
            )
        }

        const tokens = await this.generateAuthTokens(user.id)
        const { password: _, ...userWithoutPassword } = user

        return { user: userWithoutPassword, ...tokens }
    }

    /**
     * Registers a new user and returns JWT tokens immediately.
     */
    async register(credentials: RegisterSchemaType): Promise<AuthResponse> {
        const hashedPassword = await bcrypt.hash(
            credentials.password,
            config.bcryptSaltRounds,
        )
        const persistenceData: CreateUserDto = {
            ...credentials,
            password: hashedPassword,
        }
        const newUser = await this.usersRepository.createUser(persistenceData)
        if (!newUser) {
            throw new AppError(
                MSG_REGISTRATION_FAILED,
                StatusCodes.INTERNAL_SERVER_ERROR,
            )
        }

        const tokens = await this.generateAuthTokens(newUser.id)
        const userWithoutPassword = newUser

        return {
            ...tokens,
            user: userWithoutPassword,
        }
    }

    async refreshAuth(incomingRefreshToken: string): Promise<RefreshResponse> {
        let userId: string
        let tokenId: string
        try {
            const decoded = jwt.verify(
                incomingRefreshToken,
                config.jwtRefreshSecret,
            ) as {
                id: string
                jti: string
            }
            userId = decoded.id
            tokenId = decoded.jti
            if (!tokenId) throw new Error('Missing JTI')
        } catch {
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        const existingToken =
            await this.usersRepository.findRefreshTokenById(tokenId)

        if (!existingToken) {
            log.warn(`${MSG_TOKEN_REUSE_DETECTED} User ID: ${userId}`)
            await this.usersRepository.deleteAllRefreshTokensForUser(userId)
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        const isValid = await bcrypt.compare(
            incomingRefreshToken,
            existingToken.tokenHash,
        )
        if (!isValid) {
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        if (existingToken.expiresAt < new Date()) {
            await this.usersRepository.deleteRefreshToken(existingToken.id)
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        await this.usersRepository.deleteRefreshToken(existingToken.id)

        return this.generateAuthTokens(userId)
    }

    // Additional auth-related methods can be added here
}
