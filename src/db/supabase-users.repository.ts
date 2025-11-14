/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/db/supabase-users.repository.ts
 * @title Supabase User Repository
 * @description Supabase-specific implementation of the IUserRepository.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import { supabase } from '@config/supabase.js'
import type { CreateUserPersistence, IUserRepository, UpdateUserPersistence } from '@db/users.repository.interface.js'
import type { User, UserWithPassword } from '@models/user.model.js'
import { AppError } from '@typings/errors/AppError.js'

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
const COL_ALL_WITHOUT_PASSWORD = `${COL_ID}, ${COL_NAME}, ${COL_EMAIL}, created_at, updated_at`

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

export class SupabaseUsersRepository implements IUserRepository {
    private createNotFoundMessage(contextId?: string): string {
        const idInfo = contextId ? ` with ID ${contextId}` : ''
        return `${MSG_RESOURCE_NOT_FOUND_PREFIX}${idInfo} ${MSG_RESOURCE_NOT_FOUND_SUFFIX}`
    }

    private handleSupabaseError(error: SupabaseError, contextId?: string): never {
        switch (error.code) {
            // Case: PostgreSQL unique violation (e.g., duplicate email)
            case PG_CODE_UNIQUE_VIOLATION:
                throw new AppError(MSG_EMAIL_IN_USE, HTTP_STATUS_CONFLICT)

            // Case: PostgREST ".single()" found no rows
            case PG_CODE_NO_ROWS_FOUND:
                throw new AppError(this.createNotFoundMessage(contextId), HTTP_STATUS_NOT_FOUND)

            // Default to 500 Internal Server Error
            default:
                // Log the original error message but throw a generic one
                throw new AppError(error.message, HTTP_STATUS_INTERNAL_ERROR)
        }
    }

    async getAllUsers(): Promise<User[] | null> {
        const { data, error } = await supabase.from(TABLE_NAME).select(COL_ALL_WITHOUT_PASSWORD)
        if (error) this.handleSupabaseError(error)
        return data
    }

    async getUserById(id: string): Promise<User | null> {
        const { data, error } = await supabase.from(TABLE_NAME).select(COL_ALL_WITHOUT_PASSWORD).eq(COL_ID, id).single()
        if (error) this.handleSupabaseError(error, id)
        return data
    }

    async findUserByEmail(email: string): Promise<UserWithPassword | null> {
        const { data, error } = await supabase.from(TABLE_NAME).select(COL_ALL).eq(COL_EMAIL, email).maybeSingle()

        if (error && error.code !== 'PGRST116') {
            this.handleSupabaseError(error)
        }
        return data
    }

    async createUser(userData: CreateUserPersistence): Promise<User | null> {
        // !! MODIFICATION IMPORTANTE !!
        // On ne retourne plus le mot de passe
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(userData)
            .select(COL_ALL_WITHOUT_PASSWORD)
            .single()
        if (error) this.handleSupabaseError(error)
        return data
    }

    async updateUser(userId: string, userData: UpdateUserPersistence): Promise<User | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(userData)
            .eq(COL_ID, userId)
            .select(COL_ALL_WITHOUT_PASSWORD)
            .single()
        if (error) this.handleSupabaseError(error, userId)
        return data
    }

    async deleteUser(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq(COL_ID, id)
            .select(COL_ALL_WITHOUT_PASSWORD)
            .single()
        if (error) this.handleSupabaseError(error, id)
        return data
    }
}
