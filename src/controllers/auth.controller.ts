/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/auth.controller.ts
 * @title Auth Route Controllers
 * @description HTTP request handlers for authentication routes.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import * as authService from '@services/auth.service.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'

// --- Constants ---

// Success Messages
const MSG_LOGIN_SUCCESS = 'Login successful'
const MSG_REGISTER_SUCCESS = 'Registration successful'

/**
 * Controller to handle user register.
 * @param req - The Express Request object (body is validated by middleware).
 * @param res - The Express Response object.
 */
export const register = async (req: Request, res: Response) => {
    const userWithToken = await authService.register(req.body)
    sendSuccess(res, 201, MSG_REGISTER_SUCCESS, userWithToken)
}

/**
 * Controller to handle user login.
 * @param req - The Express Request object (body is validated by middleware).
 * @param res - The Express Response object.
 */
export const login = async (req: Request, res: Response) => {
    const userWithToken = await authService.login(req.body)
    sendSuccess(res, 200, MSG_LOGIN_SUCCESS, userWithToken)
}
