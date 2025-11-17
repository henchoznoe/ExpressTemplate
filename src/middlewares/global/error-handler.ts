/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/global/error-handler.ts
 * @title Global Error Handlers
 * @description Configures and provides the final error handling middlewares (404 and 500).
 * @last-modified 2025-11-17
 */

import { log } from '@config/logger.js'
import { AppError } from '@typings/errors/AppError.js'
import { sendError } from '@utils/http-responses.js'
import type { Application, NextFunction, Request, Response } from 'express'

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
    next(new AppError(`${MSG_ROUTE_NOT_FOUND_PREFIX}: ${req.path}`, 404))
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
    // Case 1: Operational Error (AppError)
    // These are expected errors (e.g., "User not found") and we can safely send the message.
    if (err instanceof AppError) {
        log.warn(`Operational error: ${err.message}`)
        return sendError(res, err.status, err.message, err.data)
    }

    // Case 2: Programming Error (Standard Error)
    // These are unexpected errors. We log the full stack but send a generic message.
    if (err instanceof Error) {
        log.error('Unexpected error:', err)
    } else {
        // Case 3: Unknown error type
        log.error(MSG_UNKNOWN_ERROR_TYPE, err)
    }

    sendError(res, 500, MSG_INTERNAL_SERVER_ERROR)
}
