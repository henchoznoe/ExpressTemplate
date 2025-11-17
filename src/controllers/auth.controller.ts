/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/auth.controller.ts
 * @title Auth Route Controllers
 * @description HTTP request handlers for authentication routes.
 * @last-modified 2025-11-17
 */

import type { AuthService } from '@services/auth.service.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'

// --- Constants ---
const MSG_LOGIN_SUCCESS = 'Login successful'
const MSG_REGISTER_SUCCESS = 'Registration successful'

export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * Controller to handle user register.
     */
    register = async (req: Request, res: Response) => {
        const userWithToken = await this.authService.register(req.body)
        sendSuccess(res, 201, MSG_REGISTER_SUCCESS, userWithToken)
    }

    /**
     * Controller to handle user login.
     */
    login = async (req: Request, res: Response) => {
        const userWithToken = await this.authService.login(req.body)
        sendSuccess(res, 200, MSG_LOGIN_SUCCESS, userWithToken)
    }
}
