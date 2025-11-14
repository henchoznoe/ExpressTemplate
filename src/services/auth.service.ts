/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/auth.service.ts
 * @title Authentication Service Logic
 * @description Handles login, registration, and JWT generation.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import config from '@config/env.js'
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { LoginSchemaType, RegisterSchemaType } from '@schemas/auth.schema.js'
import type { UserService } from '@services/users.service.js'
import { AppError } from '@typings/errors/AppError.js'
import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'

// --- Constants ---
const HTTP_STATUS_UNAUTHORIZED = 401
const MSG_INVALID_CREDENTIALS = 'Invalid email or password'
const HTTP_STATUS_INTERNAL_ERROR = 500
const MSG_REGISTRATION_FAILED = 'User registration failed'

export class AuthService {
    constructor(
        private usersRepository: IUserRepository,
        private userService: UserService,
    ) {}

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
            throw new AppError(MSG_INVALID_CREDENTIALS, HTTP_STATUS_UNAUTHORIZED)
        }
        const token = await this.signToken(user.id)
        const { password: _, ...userWithoutPassword } = user
        return { ...userWithoutPassword, token }
    }

    async register(credentials: RegisterSchemaType) {
        const newUser = await this.userService.createUser(credentials)
        if (!newUser) {
            throw new AppError(MSG_REGISTRATION_FAILED, HTTP_STATUS_INTERNAL_ERROR)
        }
        const token = await this.signToken(newUser.id)
        return { ...newUser, token }
    }
}
