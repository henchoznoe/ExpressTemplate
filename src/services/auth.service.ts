/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/auth.service.ts
 * @title Authentication Service Logic
 * @description Handles login logic, password verification, and JWT generation.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import config from '@config/env.js'
import * as usersRepository from '@db/users.repository.js'
import type { LoginSchemaType, RegisterSchemaType } from '@schemas/auth.schema.js'
import { AppError } from '@typings/errors/AppError.js'
import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'

// --- Constants ---
const HTTP_STATUS_UNAUTHORIZED = 401
const MSG_INVALID_CREDENTIALS = 'Invalid email or password'
const HTTP_STATUS_INTERNAL_ERROR = 500
const MSG_REGISTRATION_FAILED = 'User registration failed'

/**
 * Generates a signed JWT for a given user ID.
 * @param userId - The user's ID to include in the token payload.
 * @returns The signed JWT string.
 */
const signToken = async (userId: string) => {
    return jwt.sign(
        { id: userId },
        config.jwtSecret as string,
        {
            expiresIn: config.jwtExpiresIn,
        } as SignOptions,
    )
}

/**
 * Attempts to log in a user with the provided credentials.
 * @param credentials - The user's email and password.
 * @returns A promise that resolves to an object containing the JWT.
 * @throws {AppError} if credentials are invalid or user not found.
 */
export const login = async (credentials: LoginSchemaType) => {
    const { email, password } = credentials
    const user = await usersRepository.findUserByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError(MSG_INVALID_CREDENTIALS, HTTP_STATUS_UNAUTHORIZED)
    }
    const token = await signToken(user.id)
    const { password: _, ...userWithoutPassword } = user
    return { ...userWithoutPassword, token }
}

/**
 * Creates a new user and returns the user object with a JWT.
 * @param credentials - The user's name, email, and password.
 * @returns A promise that resolves to an object containing the new user and JWT.
 * @throws {AppError} if email is already in use (handled by repository).
 */
export const register = async (credentials: RegisterSchemaType) => {
    const hashedPassword = await bcrypt.hash(credentials.password, config.bcryptSaltRounds)
    const dataWithHashedPassword = { ...credentials, password: hashedPassword }
    const newUser = await usersRepository.createUser(dataWithHashedPassword)
    if (!newUser) {
        throw new AppError(MSG_REGISTRATION_FAILED, HTTP_STATUS_INTERNAL_ERROR)
    }
    const token = await signToken(newUser.id)
    const { password: _, ...userWithoutPassword } = newUser
    return { ...userWithoutPassword, token }
}
