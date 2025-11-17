/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/users.controller.ts
 * @title User Route Controllers
 * @description This file contains the HTTP request handlers for all user-related routes.
 * @last-modified 2025-11-17
 */

import type { PaginationSchemaType } from '@schemas/common.schema.js'
import type { UserService } from '@services/users.service.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

// --- Constants ---
const MSG_USERS_RETRIEVED = 'Users retrieved successfully'
const MSG_USER_RETRIEVED = 'User retrieved successfully'
const MSG_USER_CREATED = 'User created successfully'
const MSG_USER_UPDATED = 'User updated successfully'
const MSG_USER_DELETED = 'User deleted successfully'

export class UserController {
    constructor(private userService: UserService) {}

    getAllUsers = async (req: Request, res: Response) => {
        const { page, limit } = req.validatedQuery as PaginationSchemaType
        const skip = (page - 1) * limit
        const take = limit
        const users = await this.userService.getAllUsers({ skip, take })
        sendSuccess(res, StatusCodes.OK, MSG_USERS_RETRIEVED, users || [])
    }

    getUserById = async (req: Request, res: Response) => {
        const userId = req.params.id
        const user = await this.userService.getUserById(userId)
        sendSuccess(res, StatusCodes.OK, MSG_USER_RETRIEVED, user)
    }

    createUser = async (req: Request, res: Response) => {
        const newUser = await this.userService.createUser(req.body)
        sendSuccess(res, StatusCodes.CREATED, MSG_USER_CREATED, newUser)
    }

    updateUser = async (req: Request, res: Response) => {
        const userId = req.params.id
        const updatedUser = await this.userService.updateUser(userId, req.body)
        sendSuccess(res, StatusCodes.OK, MSG_USER_UPDATED, updatedUser)
    }

    deleteUser = async (req: Request, res: Response) => {
        const userId = req.params.id
        const deletedUser = await this.userService.deleteUser(userId)
        sendSuccess(res, StatusCodes.OK, MSG_USER_DELETED, deletedUser)
    }
}
