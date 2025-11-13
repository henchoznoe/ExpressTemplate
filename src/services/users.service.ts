/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/users.service.ts
 * @title User Service Logic
 * @description This file contains the business logic for user-related operations.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import config from '@config/env.js'
import * as usersRepository from '@db/users.repository.js'
import bcrypt from 'bcrypt'
import type { CreateUserSchemaType, UpdateUserSchemaType } from '@/schemas/users.schema.js'

/**
 * Retrieves a list of all users.
 * @returns A promise that resolves to an array of all users.
 */
export const getAllUsers = async () => usersRepository.getAllUsers()

/**
 * Retrieves a single user by their unique ID.
 * @param id - The UUID of the user to retrieve.
 * @returns A promise that resolves to the user object, or throws if not found.
 */
export const getUserById = async (id: string) => usersRepository.getUserById(id)

/**
 * Creates a new user in the database.
 * Hashes the password before storing.
 * @param userData - The user data (name, email, password) matching the schema.
 * @returns A promise that resolves to the newly created user object.
 */
export const createUser = async (userData: CreateUserSchemaType) => {
    const hashedPassword = await bcrypt.hash(userData.password, config.bcryptSaltRounds)
    const dataWithHashedPassword = { ...userData, password: hashedPassword }
    return usersRepository.createUser(dataWithHashedPassword)
}

/**
 * Updates an existing user's data by their ID.
 * If a password is provided, it will be hashed.
 * @param userId - The UUID of the user to update.
 * @param userData - The user data to update, including the user's ID.
 * @returns A promise that resolves to the updated user object.
 */
export const updateUser = async (userId: string, userData: UpdateUserSchemaType) => {
    const { password, ...rest } = userData

    // Case 1: Password is NOT being updated
    // Pass the original data (minus the undefined password) to the repo.
    if (!password) {
        return usersRepository.updateUser(userId, userData)
    }

    // Case 2: Password IS being updated
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds)

    // Create the new object to pass to the repository
    const dataWithHashedPassword = { ...rest, password: hashedPassword }

    return usersRepository.updateUser(userId, dataWithHashedPassword)
}

/**
 * Deletes a user by their unique ID.
 * @param id - The UUID of the user to delete.
 * @returns A promise that resolves to the deleted user object.
 */
export const deleteUser = async (id: string) => {
    return usersRepository.deleteUser(id)
}
