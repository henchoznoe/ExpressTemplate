/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/global/error-handler.ts
 * @title Global Error Handlers
 * @description Configures and provides the final error handling middlewares (404 and 500).
 * @last-modified 2025-11-13
 */

// --- Imports ---
import { log } from '@config/logger.js'
import { Prisma } from '@prisma/client'
import { AppError } from '@typings/errors/AppError.js'
import { sendError } from '@utils/http-responses.js'
import type { Application, NextFunction, Request, Response } from 'express'

// --- Constants ---

const MSG_INTERNAL_SERVER_ERROR = 'Internal Server Error'
const MSG_UNKNOWN_ERROR_TYPE = 'Unknown error type'
const MSG_ROUTE_NOT_FOUND_PREFIX = 'Route not found:'

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
 * @param res - The Express Response object.
 */
const handleNotFound = (req: Request, res: Response) => {
    sendError(res, 404, `${MSG_ROUTE_NOT_FOUND_PREFIX} ${req.path}`)
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
export const globalErrorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    // Case 1: Operational Error (AppError)
    // These are expected errors (e.g., "User not found") and we can safely send the message.
    if (err instanceof AppError) {
        log.warn(`Operational error: ${err.message}`)
        return sendError(res, err.status, err.message)
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const message = 'Email address already in use.'
            log.warn(`Prisma error (P2002): ${message}`)
            return sendError(res, 409, message)
        }
        if (err.code === 'P2025') {
            const message = 'Resource not found.'
            log.warn(`Prisma error (P2025): ${message}`)
            return sendError(res, 404, message)
        }
        // Additional Prisma error codes can be handled here as needed
    }

    // Case 2: Programming Error (Standard Error)
    // These are unexpected errors. We log the full stack but send a generic message.
    if (err instanceof Error) {
        log.error(`Unexpected error: ${err.message}\n${err.stack}`)
    } else {
        // Case 3: Unknown error type
        log.error(MSG_UNKNOWN_ERROR_TYPE, err)
    }

    sendError(res, 500, MSG_INTERNAL_SERVER_ERROR)
}
