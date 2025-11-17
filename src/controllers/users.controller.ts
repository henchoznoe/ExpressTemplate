/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/users.controller.ts
 * @title User Route Controllers
 * @description This file contains the HTTP request handlers for all user-related routes.
 * @last-modified 2025-11-17
 */

import type { UserService } from '@services/users.service.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'

// --- Constants ---
const MSG_USERS_RETRIEVED = 'Users retrieved successfully'
const MSG_USER_RETRIEVED = 'User retrieved successfully'
const MSG_USER_CREATED = 'User created successfully'
const MSG_USER_UPDATED = 'User updated successfully'
const MSG_USER_DELETED = 'User deleted successfully'

export class UserController {
    constructor(private userService: UserService) {}

    getAllUsers = async (_req: Request, res: Response) => {
        const users = await this.userService.getAllUsers()
        sendSuccess(res, 200, MSG_USERS_RETRIEVED, users || [])
    }

    getUserById = async (req: Request, res: Response) => {
        const userId = req.params.id
        const user = await this.userService.getUserById(userId)
        sendSuccess(res, 200, MSG_USER_RETRIEVED, user)
    }

    createUser = async (req: Request, res: Response) => {
        const newUser = await this.userService.createUser(req.body)
        sendSuccess(res, 201, MSG_USER_CREATED, newUser)
    }

    updateUser = async (req: Request, res: Response) => {
        const userId = req.params.id
        const updatedUser = await this.userService.updateUser(userId, req.body)
        sendSuccess(res, 200, MSG_USER_UPDATED, updatedUser)
    }

    deleteUser = async (req: Request, res: Response) => {
        const userId = req.params.id
        const deletedUser = await this.userService.deleteUser(userId)
        sendSuccess(res, 200, MSG_USER_DELETED, deletedUser)
    }
}
