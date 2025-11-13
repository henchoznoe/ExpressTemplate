/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/auth.controller.ts
 * @title Auth Route Controllers
 * @description HTTP request handlers for authentication routes.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import * as authService from '@services/auth.service.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'

// --- Constants ---

// Success Messages
const MSG_LOGIN_SUCCESS = 'Login successful'

/**
 * Controller to handle user register.
 * @param _req
 * @param _res
 */
export const register = async (_req: Request, _res: Response) => {
    // TODO
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
