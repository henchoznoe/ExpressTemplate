/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/users.controller.ts
 * @title User Route Controllers
 * @description This file contains the HTTP request handlers for all user-related routes.
 * @last-modified 2025-11-11
 */

import * as usersService from '@services/users.service.js'
// --- Imports ---
import { AppError } from '@typings/errors/AppError.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'

// --- Constants ---

// Success Messages
const MSG_USERS_RETRIEVED = 'Users retrieved successfully'
const MSG_USER_RETRIEVED = 'User retrieved successfully'
const MSG_USER_CREATED = 'User created successfully'
const MSG_USER_UPDATED = 'User updated successfully'
const MSG_USER_DELETED = 'User deleted successfully'

// Error Messages
const MSG_NO_USERS_FOUND = 'No users found'

// Request Parameter Keys
const PARAM_ID = 'id'

// --- Controller Functions ---

/**
 * Controller to get all users.
 * @param _req - The Express Request object (unused).
 * @param res - The Express Response object.
 */
export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await usersService.getAllUsers()

    // This is business logic: an empty list is not a DB error, but we treat it as 404.
    if (!users || users.length === 0) {
        throw new AppError(MSG_NO_USERS_FOUND, 404)
    }

    sendSuccess(res, 200, MSG_USERS_RETRIEVED, users)
}

/**
 * Controller to get a single user by their ID.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 */
export const getUserById = async (req: Request, res: Response) => {
    const userId = req.params[PARAM_ID]
    const user = await usersService.getUserById(userId)
    sendSuccess(res, 200, MSG_USER_RETRIEVED, user)
}

/**
 * Controller to create a new user.
 * @param req - The Express Request object (body is validated by middleware).
 * @param res - The Express Response object.
 */
export const createUser = async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body)
    sendSuccess(res, 201, MSG_USER_CREATED, newUser)
}

/**
 * Controller to update an existing user.
 * @param req - The Express Request object (body is validated by middleware).
 * @param res - The Express Response object.
 */
export const updateUser = async (req: Request, res: Response) => {
    const updatedUser = await usersService.updateUser(req.body)
    sendSuccess(res, 200, MSG_USER_UPDATED, updatedUser)
}

/**
 * Controller to delete a user by their ID.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 */
export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params[PARAM_ID]
    const deletedUser = await usersService.deleteUser(userId)
    sendSuccess(res, 200, MSG_USER_DELETED, deletedUser)
}
