/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/users.service.ts
 * @title User Service Logic
 * @description This file contains the business logic for user-related operations.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import * as usersRepository from '@db/users.repository.js'
import type { CreateUserSchemaType, UpdateUserSchemaType } from '@/schemas/users.schema.js'

// --- Service Functions ---

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
 * @param userData - The user data (name, email, password) matching the schema.
 * @returns A promise that resolves to the newly created user object.
 */
export const createUser = async (userData: CreateUserSchemaType) => {
    return usersRepository.createUser(userData)
}

/**
 * Updates an existing user's data by their ID.
 * @param userData - The user data to update, including the user's ID.
 * @returns A promise that resolves to the updated user object.
 */
export const updateUser = async (userData: UpdateUserSchemaType) => {
    return usersRepository.updateUser(userData)
}

/**
 * Deletes a user by their unique ID.
 * @param id - The UUID of the user to delete.
 * @returns A promise that resolves to the deleted user object.
 */
export const deleteUser = async (id: string) => {
    return usersRepository.deleteUser(id)
}
