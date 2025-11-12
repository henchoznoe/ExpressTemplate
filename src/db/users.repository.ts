/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/db/users.repository.ts
 * @title User Database Repository
 * @description This file contains all database access logic for the 'users' table.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import { supabase } from '@config/supabase.js'
import type { CreateUserSchemaType, UpdateUserSchemaType } from '@schemas/users.schema.js'
import { AppError } from '@typings/errors/AppError.js'

// --- Types ---

/**
 * Represents the minimal structure of a Supabase/PostgREST error.
 */
type SupabaseError = {
    code: string
    message: string
}

// --- Constants ---

// Table and Column Names
const TABLE_NAME = 'users'
const COL_ALL = '*'
const COL_ID = 'id'
const COL_EMAIL = 'email'
const COL_NAME = 'name'
const COL_ALL_WITHOUT_PASSWORD = `${COL_ID}, ${COL_NAME}, ${COL_EMAIL}`

// PostgreSQL Error Codes
const PG_CODE_UNIQUE_VIOLATION = '23505'
const PG_CODE_NO_ROWS_FOUND = 'PGRST116' // PostgREST code for .single() finding no rows

// HTTP Status Codes
const HTTP_STATUS_CONFLICT = 409
const HTTP_STATUS_NOT_FOUND = 404
const HTTP_STATUS_INTERNAL_ERROR = 500

// Error Messages
const MSG_EMAIL_IN_USE = 'Email address already in use.'
const MSG_RESOURCE_NOT_FOUND_PREFIX = 'Resource'
const MSG_RESOURCE_NOT_FOUND_SUFFIX = 'not found.'

// --- Error Handling ---

/**
 * Creates a "Not Found" error message, specifying the ID if provided.
 * @param contextId - The ID of the resource that was not found.
 * @returns A formatted "Not Found" message.
 */
const createNotFoundMessage = (contextId?: string): string => {
    const idInfo = contextId ? ` with ID ${contextId}` : ''
    return `${MSG_RESOURCE_NOT_FOUND_PREFIX}${idInfo} ${MSG_RESOURCE_NOT_FOUND_SUFFIX}`
}

/**
 * Translates Supabase/PostgreSQL errors into application-specific AppErrors.
 * This prevents leaking database-specific details to the client.
 * @param error - The error object from Supabase.
 * @param contextId - An optional ID (e.g., user ID) for context in error messages.
 * @throws {AppError} Throws a formatted AppError, terminating the function.
 */
const handleSupabaseError = (error: SupabaseError, contextId?: string): never => {
    switch (error.code) {
        // Case: PostgreSQL unique violation (e.g., duplicate email)
        case PG_CODE_UNIQUE_VIOLATION:
            throw new AppError(MSG_EMAIL_IN_USE, HTTP_STATUS_CONFLICT)

        // Case: PostgREST ".single()" found no rows
        case PG_CODE_NO_ROWS_FOUND:
            throw new AppError(createNotFoundMessage(contextId), HTTP_STATUS_NOT_FOUND)

        // Default to 500 Internal Server Error
        default:
            // Log the original error message but throw a generic one
            throw new AppError(error.message, HTTP_STATUS_INTERNAL_ERROR)
    }
}

// --- Repository Functions ---

/**
 * Retrieves all users from the database.
 * @returns A promise that resolves to an array of all users.
 */
export const getAllUsers = async () => {
    const { data, error } = await supabase.from(TABLE_NAME).select(COL_ALL_WITHOUT_PASSWORD)
    if (error) handleSupabaseError(error)
    return data
}

/**
 * Retrieves a single user by their ID.
 * @param id - The UUID of the user to retrieve.
 * @returns A promise that resolves to the user object.
 * @throws {AppError} (via handleSupabaseError) if the user is not found.
 */
export const getUserById = async (id: string) => {
    const { data, error } = await supabase.from(TABLE_NAME).select(COL_ALL_WITHOUT_PASSWORD).eq(COL_ID, id).single()
    if (error) handleSupabaseError(error, id)
    return data
}

/**
 * Retrieves a single user by their email address.
 * IMPORTANT: This select includes the password for auth checking.
 * DO NOT use this function to send data to the client.
 * @param email - The email of the user to retrieve.
 * @returns A promise that resolves to the user object, or null if not found.
 */
export const findUserByEmail = async (email: string) => {
    const { data, error } = await supabase.from(TABLE_NAME).select(COL_ALL).eq(COL_EMAIL, email).maybeSingle()

    if (error && error.code !== PG_CODE_NO_ROWS_FOUND) {
        handleSupabaseError(error)
    }

    return data
}

/**
 * Inserts a new user into the database.
 * @param userData - The data for the new user.
 * @returns A promise that resolves to the newly created user object.
 * @throws {AppError} (via handleSupabaseError) if the email is already in use.
 */
export const createUser = async (userData: CreateUserSchemaType) => {
    const { data, error } = await supabase.from(TABLE_NAME).insert(userData).select(COL_ALL_WITHOUT_PASSWORD).single()
    if (error) handleSupabaseError(error)
    return data
}

/**
 * Updates an existing user in the database.
 * @param userData - The user data to update, including the user 'id'.
 * @returns A promise that resolves to the updated user object.
 * @throws {AppError} (via handleSupabaseError) if the user is not found.
 */
export const updateUser = async (userId: string, userData: UpdateUserSchemaType) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(userData)
        .eq(COL_ID, userId)
        .select(COL_ALL_WITHOUT_PASSWORD)
        .single()
    if (error) handleSupabaseError(error, userId)
    return data
}

/**
 * Deletes a user from the database by their ID.
 * @param id - The UUID of the user to delete.
 * @returns A promise that resolves to the deleted user object.
 * @throws {AppError} (via handleSupabaseError) if the user is not found.
 */
export const deleteUser = async (id: string) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq(COL_ID, id)
        .select(COL_ALL_WITHOUT_PASSWORD)
        .single()
    if (error) handleSupabaseError(error, id)
    return data
}
