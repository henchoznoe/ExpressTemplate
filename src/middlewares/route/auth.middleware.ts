/**
 * @file src/middlewares/route/auth.middleware.ts
 * @title Authentication Middleware
 * @description Middleware to protect routes by validating JWT.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { config } from '@config/env.js'
import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

const { JsonWebTokenError, TokenExpiredError } = jwt

// --- Constants ---
const MSG_NO_TOKEN = 'Access denied. No token provided.'
const MSG_INVALID_TOKEN = 'Invalid token.'
const MSG_TOKEN_EXPIRED = 'Token expired.'

/**
 * Middleware to protect routes.
 * Verifies the JWT and attaches the user ID to the request object.
 */
export const protect = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : undefined
    if (!token)
        return next(new AppError(MSG_NO_TOKEN, StatusCodes.UNAUTHORIZED))

    try {
        const decoded = jwt.verify(token, config.jwtAccessSecret)

        if (
            typeof decoded !== 'object' ||
            decoded === null ||
            !('id' in decoded) ||
            typeof decoded.id !== 'string'
        ) {
            throw new AppError(MSG_INVALID_TOKEN, StatusCodes.UNAUTHORIZED)
        }

        req.user = { id: decoded.id }
        next()
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next(
                new AppError(MSG_TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED),
            )
        }
        if (error instanceof JsonWebTokenError) {
            return next(
                new AppError(MSG_INVALID_TOKEN, StatusCodes.UNAUTHORIZED),
            )
        }
        return next(new AppError(MSG_INVALID_TOKEN, StatusCodes.UNAUTHORIZED))
    }
}
