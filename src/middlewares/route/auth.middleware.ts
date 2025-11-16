/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/auth.middleware.ts
 * @title Authentication Middleware
 * @description Middleware to protect routes by validating JWT.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import config from '@config/env.js'
import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { usersRepository } from '@/dependencies.js'

// --- Constants ---
const MSG_NO_TOKEN = 'Access denied. No token provided.'
const MSG_INVALID_TOKEN = 'Invalid token.'
const MSG_USER_NOT_FOUND = 'User belonging to this token no longer exists.'

/**
 * Middleware to protect routes.
 * Verifies the JWT and attaches the user ID to the request object.
 */
export const protect = async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined
    if (!token) throw new AppError(MSG_NO_TOKEN, 401)
    let payload: { id: string }
    try {
        const decoded = jwt.verify(token, config.jwtSecret)
        payload = decoded as { id: string }
    } catch (_) {
        throw new AppError(MSG_INVALID_TOKEN, 401)
    }
    const currentUser = await usersRepository.getUserById(payload.id)
    if (!currentUser) throw new AppError(MSG_USER_NOT_FOUND, 401)
    req.user = { id: currentUser.id }
    next()
}
