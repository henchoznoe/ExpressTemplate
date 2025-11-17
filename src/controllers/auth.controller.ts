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
import { StatusCodes } from 'http-status-codes'

// --- Constants ---
const MSG_LOGIN_SUCCESS = 'Login successful'
const MSG_REGISTER_SUCCESS = 'Registration successful'
const MSG_REFRESH_SUCCESS = 'Tokens refreshed successfully'

export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * Controller to handle user register.
     */
    register = async (req: Request, res: Response) => {
        const userWithToken = await this.authService.register(req.body)
        sendSuccess(
            res,
            StatusCodes.CREATED,
            MSG_REGISTER_SUCCESS,
            userWithToken,
        )
    }

    /**
     * Controller to handle user login.
     */
    login = async (req: Request, res: Response) => {
        const userWithToken = await this.authService.login(req.body)
        sendSuccess(res, StatusCodes.OK, MSG_LOGIN_SUCCESS, userWithToken)
    }

    /**
     * Controller to handle token refresh.
     */
    refresh = async (req: Request, res: Response) => {
        const { refreshToken } = req.body
        const tokens = await this.authService.refreshAuth(refreshToken)
        sendSuccess(res, StatusCodes.OK, MSG_REFRESH_SUCCESS, tokens)
    }
}
