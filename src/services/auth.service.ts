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
import jwt, { type SignOptions } from 'jsonwebtoken'

// --- Constants ---
const MSG_INVALID_CREDENTIALS = 'Invalid email or password'
const MSG_REGISTRATION_FAILED = 'User registration failed'
const MSG_INVALID_REFRESH_TOKEN = 'Invalid refresh token'

export class AuthService {
    constructor(private usersRepository: IUserRepository) {}

    /**
     * Hashes a token string using SHA-256.
     * Used for secure storage in the database.
     */
    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex')
    }

    /**
     * Generates a pair of Access and Refresh tokens, and persists the Refresh Token.
     */
    private async generateAuthTokens(userId: string) {
        // Generate Access Token
        const accessToken = jwt.sign({ id: userId }, config.jwtAccessSecret, {
            expiresIn: config.jwtAccessExpiresIn,
        } as SignOptions)

        // Generate Refresh Token
        const refreshToken = jwt.sign({ id: userId }, config.jwtRefreshSecret, {
            expiresIn: config.jwtRefreshExpiresIn,
        } as SignOptions)

        // Calculate expiration date for the database
        // We decode the token to get the 'exp' claim (unix timestamp) computed by jsonwebtoken
        const decoded = jwt.decode(refreshToken) as { exp: number }
        const expiresAt = new Date(decoded.exp * 1000)

        // Persist the hashed refresh token
        const tokenHash = this.hashToken(refreshToken)
        await this.usersRepository.createRefreshToken(
            userId,
            tokenHash,
            expiresAt,
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
        // Verify JWT Signature
        let userId: string
        try {
            const decoded = jwt.verify(
                incomingRefreshToken,
                config.jwtRefreshSecret,
            ) as { id: string }
            userId = decoded.id
        } catch {
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        // Verify existence in DB (Protection against reuse/revocation)
        const tokenHash = this.hashToken(incomingRefreshToken)
        const existingToken =
            await this.usersRepository.findRefreshTokenByHash(tokenHash)

        if (!existingToken) {
            // Reuse Detection: The token is valid (JWT) but not in DB.
            // This means it was likely already used and rotated. Potential theft.
            // TODO: In v2.1, implement "Delete All Tokens" for this user here.
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        // Check DB Expiration (Safety net)
        if (existingToken.expiresAt < new Date()) {
            await this.usersRepository.deleteRefreshToken(existingToken.id)
            throw new AppError(
                MSG_INVALID_REFRESH_TOKEN,
                StatusCodes.UNAUTHORIZED,
            )
        }

        // Rotation: Revoke (delete) the used token
        await this.usersRepository.deleteRefreshToken(existingToken.id)

        // Issue new pair
        return this.generateAuthTokens(userId)
    }

    // Additional auth-related methods can be added here
}
