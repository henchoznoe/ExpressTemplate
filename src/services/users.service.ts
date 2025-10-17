import * as usersRepository from '@db/users.repository.js'
import type { CreateUserSchemaType, UpdateUserSchemaType } from '@/schemas/users.schema.js'

export const getAllUsers = async () => await usersRepository.getAllUsers()

export const getUserById = async (id: string) => await usersRepository.getUserById(id)

export const createUser = async (userData: CreateUserSchemaType) => {
    return await usersRepository.createUser(userData)
}

export const updateUser = async (userData: UpdateUserSchemaType) => {
    return await usersRepository.updateUser(userData)
}

export const deleteUser = async (id: string) => {
    return await usersRepository.deleteUser(id)
}
