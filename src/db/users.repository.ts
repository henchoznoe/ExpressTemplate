import { supabase } from '@config/supabase.js'
import { AppError } from '@my-types/errors/AppError.js'
import type { CreateUserSchemaType, UpdateUserSchemaType } from '@schemas/users.schema.js'

export const getAllUsers = async () => {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw new AppError(error.message)
    return data
}

export const getUserById = async (id: string) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error) throw new AppError(error.message)
    return data
}

export const createUser = async (userData: CreateUserSchemaType) => {
    const { data, error } = await supabase.from('users').insert(userData).select().single()
    if (error) throw new AppError(error.message)
    return data
}

export const updateUser = async (userData: UpdateUserSchemaType) => {
    const { id, ...updateData } = userData
    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select().single()
    if (error) throw new AppError(error.message)
    return data
}

export const deleteUser = async (id: string) => {
    const { data, error } = await supabase.from('users').delete().eq('id', id).select().single()
    if (error) throw new AppError(error.message)
    return data
}
