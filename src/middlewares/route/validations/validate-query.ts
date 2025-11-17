/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/route/validations/validate-query.ts
 * @title Zod Validation Middleware (Query)
 * @description Provides a factory function to create Zod validation middlewares for query parameters.
 * @last-modified 2025-11-17
 */

import { AppError } from '@typings/errors/AppError.js'
import { formatZodError } from '@utils/zod-error-formatter.js'
import type { NextFunction, Request, Response } from 'express'
import type { ZodObject } from 'zod'

// --- Constants ---
const HTTP_STATUS_BAD_REQUEST = 400

export const validateQuery = (schema: ZodObject) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)
        if (!result.success) {
            const errorDetails = formatZodError(result.error)
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
