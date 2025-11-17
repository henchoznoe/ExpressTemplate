/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/route/validations/validate-query.ts
 * @title Zod Validation Middleware (Query)
 * @description Provides a factory function to create Zod validation middlewares for query parameters.
 * @last-modified 2025-11-17
 */

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

export const validateQuery = (schema: ZodObject) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)
        if (!result.success) {
            const errorDetails = formatValidationErrors(result.error)
            const errorMessage =
                (errorDetails[0] as { message: string })?.message ||
                'Invalid query parameters'
            throw new AppError(errorMessage, HTTP_STATUS_BAD_REQUEST, true, {
                issues: errorDetails,
            })
        }
        req.validatedQuery = result.data
        next()
    }
}
