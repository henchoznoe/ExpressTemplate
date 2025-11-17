/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/auth.service.ts
 * @title Authentication Service Logic
 * @description Handles login, registration, and JWT generation.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { config } from '@config/env.js'
import type {
    CreateUserPersistence,
    IUserRepository,
} from '@db/users.repository.interface.js'
import type {
    LoginSchemaType,
    RegisterSchemaType,
} from '@schemas/auth.schema.js'
import { AppError } from '@typings/errors/AppError.js'
import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'

// --- Constants ---
const MSG_INVALID_CREDENTIALS = 'Invalid email or password'
const MSG_REGISTRATION_FAILED = 'User registration failed'

export class AuthService {
    constructor(private usersRepository: IUserRepository) {}

    private async signToken(userId: string): Promise<string> {
        return jwt.sign(
            { id: userId },
            config.jwtSecret as string,
            {
                expiresIn: config.jwtExpiresIn,
            } as SignOptions,
        )
    }

    async login(credentials: LoginSchemaType) {
        const { email, password } = credentials
        const user = await this.usersRepository.findUserByEmail(email)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError(MSG_INVALID_CREDENTIALS, 401)
        }
        const token = await this.signToken(user.id)
        const { password: _, ...userWithoutPassword } = user
        return { ...userWithoutPassword, token }
    }

    async register(credentials: RegisterSchemaType) {
        const hashedPassword = await bcrypt.hash(
            credentials.password,
            config.bcryptSaltRounds,
        )
        const persistenceData: CreateUserPersistence = {
            ...credentials,
            password: hashedPassword,
        }
        const newUser = await this.usersRepository.createUser(persistenceData)
        if (!newUser) {
            throw new AppError(MSG_REGISTRATION_FAILED, 500)
        }
        const token = await this.signToken(newUser.id)
        return { ...newUser, token }
    }

    // Additional auth-related methods can be added here
}
