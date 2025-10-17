import { AppError } from '@my-types/errors/AppError.js'
import * as usersService from '@services/users.service.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { NextFunction, Request, Response } from 'express'

export const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const users = await usersService.getAllUsers()
        if (!users || users.length === 0) throw new AppError('No users found', 404)
        sendSuccess(res, 200, 'Users retrieved successfully', users)
    } catch (err) {
        next(err)
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id
        const user = await usersService.getUserById(userId)
        if (!user) throw new AppError(`User with ID ${userId} not found`, 404)
        sendSuccess(res, 200, 'User retrieved successfully', user)
    } catch (err) {
        next(err)
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await usersService.createUser(req.body)
        sendSuccess(res, 201, 'User created successfully', newUser)
    } catch (err) {
        next(err)
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await usersService.updateUser(req.body)
        sendSuccess(res, 200, 'User updated successfully', updatedUser)
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id
        const deletedUser = await usersService.deleteUser(userId)
        sendSuccess(res, 200, 'User deleted successfully', deletedUser)
    } catch (err) {
        next(err)
    }
}
