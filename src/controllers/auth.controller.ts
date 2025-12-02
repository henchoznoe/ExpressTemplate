/**
 * @file src/controllers/auth.controller.ts
 * @title Auth Route Controllers
 * @description HTTP request handlers for authentication routes.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import type { IAuthService } from '@services/auth/auth.service.interface.js'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/types/ioc.types.js'

// --- Constants ---
const MSG_EMAIL_VERIFIED = 'Email verified successfully'
const MSG_PASSWORD_RESET = 'Password reset successfully'
const MSG_RESET_LINK_SENT = 'If the email exists, a reset link has been sent.'

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

    /**
     * Controller to handle user register.
     */
    register = async (req: Request, res: Response) => {
        const userWithToken = await this.authService.register(req.body)
        res.status(StatusCodes.CREATED).json(userWithToken)
    }

    /**
     * Controller to handle user login.
     */
    login = async (req: Request, res: Response) => {
        const userWithToken = await this.authService.login(req.body)
        res.status(StatusCodes.OK).json(userWithToken)
    }

    /**
     * Controller to handle token refresh.
     */
    refresh = async (req: Request, res: Response) => {
        const { refreshToken } = req.body
        const tokens = await this.authService.refreshAuth(refreshToken)
        res.status(StatusCodes.OK).json(tokens)
    }

    /**
     * Controller to handle email verification.
     */
    verifyEmail = async (req: Request, res: Response) => {
        const { token } = req.body
        await this.authService.verifyEmail(token)
        res.status(StatusCodes.OK).json({ message: MSG_EMAIL_VERIFIED })
    }

    /**
     * Controller to initiate password reset (Forgot Password).
     */
    forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body
        await this.authService.forgotPassword(email)
        res.status(StatusCodes.OK).json({
            message: MSG_RESET_LINK_SENT,
        })
    }

    /**
     * Controller to complete password reset.
     */
    resetPassword = async (req: Request, res: Response) => {
        await this.authService.resetPassword(req.body)
        res.status(StatusCodes.OK).json({ message: MSG_PASSWORD_RESET })
    }
}
