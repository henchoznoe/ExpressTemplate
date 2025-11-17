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
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/types/ioc.types.js'

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    getAllUsers = async (req: Request, res: Response) => {
        const { page, limit } = req.validatedQuery as PaginationSchemaType
        const skip = (page - 1) * limit
        const take = limit
        const users = await this.userService.getAllUsers({ skip, take })
        res.status(StatusCodes.OK).json(users || [])
    }

    getUserById = async (req: Request, res: Response) => {
        const userId = req.params.id
        const user = await this.userService.getUserById(userId)
        res.status(StatusCodes.OK).json(user)
    }

    createUser = async (req: Request, res: Response) => {
        const newUser = await this.userService.createUser(req.body)
        res.status(StatusCodes.CREATED).json(newUser)
    }

    updateUser = async (req: Request, res: Response) => {
        const userId = req.params.id
        const updatedUser = await this.userService.updateUser(userId, req.body)
        res.status(StatusCodes.OK).json(updatedUser)
    }

    deleteUser = async (req: Request, res: Response) => {
        const userId = req.params.id
        await this.userService.deleteUser(userId)
        res.status(StatusCodes.NO_CONTENT).send()
    }
}
