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
