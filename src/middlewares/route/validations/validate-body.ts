/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/validations/validate-body.ts
 * @title Zod Validation Middleware (Body)
 * @description Provides a factory function to create Zod validation middlewares for request bodies.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import type { ZodError, ZodObject } from 'zod'

// --- Constants ---
const HTTP_STATUS_BAD_REQUEST = 400

const formatValidationErrors = (error: ZodError): object[] => {
    return error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
    }))
}

export const validateBody = (schema: ZodObject) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            const errorDetails = formatValidationErrors(result.error)
            const errorMessage = (errorDetails[0] as { message: string })?.message || 'Invalid request body'
            throw new AppError(errorMessage, HTTP_STATUS_BAD_REQUEST, true, { issues: errorDetails })
        }
        req.body = result.data
        next()
    }
}
