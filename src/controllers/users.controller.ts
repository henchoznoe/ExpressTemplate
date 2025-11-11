import { AppError } from '@my-types/errors/AppError.js'
import * as usersService from '@services/users.service.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'

export const getAllUsers = async (_: Request, res: Response) => {
    const users = await usersService.getAllUsers()
    if (!users || users.length === 0) throw new AppError('No users found', 404)
    sendSuccess(res, 200, 'Users retrieved successfully', users)
}

export const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await usersService.getUserById(userId)
    sendSuccess(res, 200, 'User retrieved successfully', user)
}

export const createUser = async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body)
    sendSuccess(res, 201, 'User created successfully', newUser)
}

export const updateUser = async (req: Request, res: Response) => {
    const updatedUser = await usersService.updateUser(req.body)
    sendSuccess(res, 200, 'User updated successfully', updatedUser)
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id
    const deletedUser = await usersService.deleteUser(userId)
    sendSuccess(res, 200, 'User deleted successfully', deletedUser)
}
