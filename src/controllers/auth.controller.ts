/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/auth.controller.ts
 * @title Auth Route Controllers
 * @description HTTP request handlers for authentication routes.
 * @last-modified 2025-11-17
 */

import type { AuthService } from '@services/auth.service.js'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/types/ioc.types.js'

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

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
}
