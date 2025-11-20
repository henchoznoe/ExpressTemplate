/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/db/users.repository.interface.ts
 * @title User Repository Interface
 * @description Defines the contract for all user repository implementations.
 * @last-modified 2025-11-20
 */

import type {
    RefreshToken,
    User,
    UserWithPassword,
} from '@models/user.model.js'

/**
 * Data shape for creating a user (requires a hashed password).
 * The service layer is responsible for hashing.
 */
export type CreateUserDto = {
    name: string
    email: string
    password: string // Must be hashed by the service
    verificationToken?: string | null
    isVerified?: boolean
}

/**
 * Data shape for updating a user (password is optional).
 * If provided, it must be hashed by the service.
 */
export type UpdateUserDto = {
    name?: string
    email?: string
    password?: string // Must be hashed by the service
    isVerified?: boolean
    verificationToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | null
}

/**
 * Options for pagination when retrieving multiple users.
 */
export type PaginationOptions = {
    skip?: number
    take?: number
}

/**
 * Contract for User data persistence.
 * Any class implementing this must provide these methods.
 */
export interface IUserRepository {
    getAllUsers(options?: PaginationOptions): Promise<User[]>
    getUserById(id: string): Promise<User>
    findUserByEmail(email: string): Promise<UserWithPassword | null>
    findUserByVerificationToken(token: string): Promise<User | null>
    findUserByResetToken(token: string): Promise<User | null>
    createUser(data: CreateUserDto): Promise<User>
    updateUser(userId: string, data: UpdateUserDto): Promise<User>
    deleteUser(id: string): Promise<User | null>

    createRefreshToken(
        id: string,
        userId: string,
        tokenHash: string,
        expiresAt: Date,
    ): Promise<RefreshToken>
    findRefreshTokenById(id: string): Promise<RefreshToken | null>
    deleteRefreshToken(id: string): Promise<RefreshToken>
    deleteAllRefreshTokensForUser(userId: string): Promise<void>
    // Additional methods can be added as needed
}
