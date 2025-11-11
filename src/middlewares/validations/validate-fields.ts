/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/validations/validate-fields.ts
 * @title Zod Validation Middleware
 * @description Provides a factory function to create Zod validation middlewares.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'

// --- Constants ---
const HTTP_STATUS_BAD_REQUEST = 400
const ZOD_ERROR_SEPARATOR = ', '
const MSG_UNKNOWN_VALIDATION_ERROR = 'Unknown validation error'

// --- Middleware Factory ---

/**
 * Factory function that creates an Express middleware for validating
 * the request body against a given Zod schema.
 *
 * @param schema - The Zod schema to use for validation.
 * @returns An Express middleware function.
 */
export const validateFields = (schema: ZodType) => {
    /**
     * The actual Express middleware function.
     * It parses the request body and passes errors to the global error handler.
     */
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Attempt to parse and validate the request body
            req.body = schema.parse(req.body)
            // If successful, proceed to the next middleware or route handler
            next()
        } catch (error) {
            // If validation fails, pass a formatted AppError to the global error handler
            next(handleValidationError(error))
        }
    }
}

// --- Error Handling ---

/**
 * Parses a validation error (Zod or otherwise) and formats it as an AppError.
 * @param error - The error caught during validation.
 * @returns An AppError instance with a formatted message and 400 status.
 */
const handleValidationError = (error: unknown): AppError => {
    // Case 1: ZodError (most common)
    if (error instanceof ZodError) {
        // Format all Zod issues into a single string
        const formattedMessages = error.issues.map(issue => issue.message).join(ZOD_ERROR_SEPARATOR)
        return new AppError(formattedMessages, HTTP_STATUS_BAD_REQUEST)
    }

    // Case 2: Standard Error
    if (error instanceof Error) {
        return new AppError(error.message, HTTP_STATUS_BAD_REQUEST)
    }

    // Case 3: Unknown error type
    return new AppError(MSG_UNKNOWN_VALIDATION_ERROR, HTTP_STATUS_BAD_REQUEST)
}
