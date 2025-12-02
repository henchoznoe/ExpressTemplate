/**
 * @file src/middlewares/global/error-handler.ts
 * @title Global Error Handlers
 * @description Configures and provides the final error handling middlewares (404 and 500).
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { log } from '@config/logger.js'
import { AppError } from '@typings/errors/AppError.js'
import type { Application, NextFunction, Request, Response } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

// --- Constants ---
const MSG_INTERNAL_SERVER_ERROR = 'Internal Server Error'
const MSG_UNKNOWN_ERROR_TYPE = 'Unknown error type'
const MSG_ROUTE_NOT_FOUND_PREFIX = 'Route not found'

/**
 * Mounts the final error handling middlewares onto the Express app.
 * IMPORTANT: This must be mounted after all other routes and middlewares.
 * @param app - The main Express application instance.
 */
export const setupErrorHandler = (app: Application) => {
    // 1. 404 Handler
    app.use(handleNotFound)
    // 2. Global Error Handler
    app.use(globalErrorHandler)
}

/**
 * Middleware to handle requests for routes that do not exist (404).
 * @param req - The Express Request object.
 * @param _ - The Express Response object (unused).
 * @param next - The Express NextFunction to pass control to the next middleware.
 */
const handleNotFound = (req: Request, _: Response, next: NextFunction) => {
    next(
        new AppError(
            `${MSG_ROUTE_NOT_FOUND_PREFIX}: ${req.path}`,
            StatusCodes.NOT_FOUND,
        ),
    )
}

/**
 * The global error handling middleware.
 * This is the final catch-all for errors. It differentiates between operational
 * errors (AppError) and unexpected programming errors.
 * @param err - The error object.
 * @param _req - The Express Request object (unused).
 * @param res - The Express Response object.
 * @param _next - The Express NextFunction (unused, but required for Express to see this as an error handler).
 */
export const globalErrorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    let status = StatusCodes.INTERNAL_SERVER_ERROR
    let message = MSG_INTERNAL_SERVER_ERROR
    let errors: object | undefined

    // Case 1: Operational Error (AppError)
    if (err instanceof AppError) {
        log.warn(`Operational error: ${err.message}`)
        status = err.status
        message = err.message
        errors = err.data ? err.data : undefined
    }
    // Case 2: Programming Error (Standard Error)
    else if (err instanceof Error) {
        log.error('Unexpected error:', err)
    }
    // Case 3: Unknown error type
    else {
        log.error(MSG_UNKNOWN_ERROR_TYPE, err)
    }

    res.status(status)
        .header('Content-Type', 'application/json')
        .json({
            detail: message,
            status,
            title: getReasonPhrase(status),
            type: 'about:blank',
            ...(errors && { errors }),
        })
}
