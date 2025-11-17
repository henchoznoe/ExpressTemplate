/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/auth.service.ts
 * @title Authentication Service Logic
 * @description Handles login, registration, and JWT generation.
 * @last-modified 2025-11-17
 */

import crypto from 'node:crypto'
import { config } from '@config/env.js'
import type {
    CreateUserDto,
    IUserRepository,
} from '@db/users.repository.interface.js'
import type {
    LoginSchemaType,
    RegisterSchemaType,
} from '@schemas/auth.schema.js'
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

@injectable()
export class AuthService {
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

    async login(credentials: LoginSchemaType) {
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

    async register(credentials: RegisterSchemaType) {
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
        return { user: newUser, ...tokens }
    }

    /**
     * Handles Refresh Token Rotation.
     * Verifies the token, checks the DB, revokes the old one, and issues a new pair.
     */
    async refreshAuth(incomingRefreshToken: string) {
        // Verify JWT Signature & Extract JTI
        let userId: string
        let tokenId: string
        try {
            const decoded = jwt.verify(
                incomingRefreshToken,
                config.jwtRefreshSecret,
            ) as { id: string; jti: string }

            userId = decoded.id
            tokenId = decoded.jti

            if (!tokenId) throw new Error('Missing JTI')
        } catch {
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        // Find by ID
        const existingToken =
            await this.usersRepository.findRefreshTokenById(tokenId)

        if (!existingToken) {
            // Token valid (crypto) but not found in DB => Replay/Theft attempt
            // TODO v2.1: Trigger global revocation for this user
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        // Secure Compare (Bcrypt)
        // Verify that the incoming token matches the stored hash
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

        // 4. Check Expiration (DB Safety net)
        if (existingToken.expiresAt < new Date()) {
            await this.usersRepository.deleteRefreshToken(existingToken.id)
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        // 5. Rotation: Consume the token
        await this.usersRepository.deleteRefreshToken(existingToken.id)

        // 6. Issue new pair
        return this.generateAuthTokens(userId)
    }

    // Additional auth-related methods can be added here
}
