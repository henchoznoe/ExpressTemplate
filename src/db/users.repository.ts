import { supabase } from '@config/supabase.js'
import { AppError } from '@my-types/errors/AppError.js'
import type { CreateUserSchemaType, UpdateUserSchemaType } from '@schemas/users.schema.js'

const handleSupabaseError = (error: { code: string; message: string }, contextId?: string): never => {
    switch (error.code) {
        // PostgreSQL unique violation
        case '23505':
            throw new AppError('Email address already in use.', 409)

        // PostgREST "No rows found" for .single()
        case 'PGRST116':
            throw new AppError(`Resource ${contextId ? `with ID ${contextId}` : ''} not found.`, 404)

        // Default to 500 Internal Server Error
        default:
            throw new AppError(error.message, 500)
    }
}

export const getAllUsers = async () => {
    const { data, error } = await supabase.from('users').select('*')
    if (error) handleSupabaseError(error)
    return data
}

export const getUserById = async (id: string) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error) handleSupabaseError(error, id)
    return data
}

export const createUser = async (userData: CreateUserSchemaType) => {
    const { data, error } = await supabase.from('users').insert(userData).select().single()
    if (error) handleSupabaseError(error)
    return data
}

export const updateUser = async (userData: UpdateUserSchemaType) => {
    const { id, ...updateData } = userData
    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select().single()
    if (error) handleSupabaseError(error, id)
    return data
}

export const deleteUser = async (id: string) => {
    const { data, error } = await supabase.from('users').delete().eq('id', id).select().single()
    if (error) handleSupabaseError(error, id)
    return data
}
