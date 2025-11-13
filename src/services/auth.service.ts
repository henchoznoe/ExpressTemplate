/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/auth.service.ts
 * @title Authentication Service Logic
 * @description Handles login logic, password verification, and JWT generation.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import config from '@config/env.js'
import * as usersRepository from '@db/users.repository.js'
import type { LoginSchemaType } from '@schemas/auth.schema.js'
import { AppError } from '@typings/errors/AppError.js'
import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'

// --- Constants ---
const HTTP_STATUS_UNAUTHORIZED = 401
const MSG_INVALID_CREDENTIALS = 'Invalid email or password'

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

    // 1. Find the user by email (includes the password hash)
    const user = await usersRepository.findUserByEmail(email)

    // 2. Check if user exists AND password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError(MSG_INVALID_CREDENTIALS, HTTP_STATUS_UNAUTHORIZED)
    }

    // 3. Generate and return the token
    const token = await signToken(user.id)

    // 4. Remove password from user object before returning and add token
    const { password: _, ...userWithoutPassword } = user
    return { ...userWithoutPassword, token }
}
