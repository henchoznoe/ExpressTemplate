/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/db/users.repository.interface.ts
 * @title User Repository Interface
 * @description Defines the contract for all user repository implementations.
 * @last-modified 2025-11-14
 */

import type { User, UserWithPassword } from '@models/user.model.js'

/**
 * Data shape for creating a user (requires a hashed password).
 * The service layer is responsible for hashing.
 */
export type CreateUserPersistence = {
    name: string
    email: string
    password: string // Must be hashed by the service
}

/**
 * Data shape for updating a user (password is optional).
 * If provided, it must be hashed by the service.
 */
export type UpdateUserPersistence = {
    name?: string
    email?: string
    password?: string // Must be hashed by the service
}

/**
 * Contract for User data persistence.
 * Any class implementing this must provide these methods.
 */
export interface IUserRepository {
    getAllUsers(): Promise<User[] | null>
    getUserById(id: string): Promise<User | null>
    findUserByEmail(email: string): Promise<UserWithPassword | null>
    createUser(data: CreateUserPersistence): Promise<User | null>
    updateUser(userId: string, data: UpdateUserPersistence): Promise<User | null>
    deleteUser(id: string): Promise<User | null>
    // Additional methods can be added as needed
}
