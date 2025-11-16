/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/validations/validate-params.ts
 * @title Zod Validation Middleware (Params)
 * @description Provides a factory function to create Zod validation middlewares for URL params.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import type { ZodError, ZodObject } from 'zod'

// --- Constants ---
const HTTP_STATUS_BAD_REQUEST = 400

const formatValidationErrors = (error: ZodError): string => {
    const firstIssue = error.issues[0]
    return firstIssue?.message || 'Invalid URL parameters'
}

export const validateParams = <T extends ZodObject>(schema: T) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params)
        if (!result.success) {
            const errorMessage = formatValidationErrors(result.error as ZodError)
            throw new AppError(errorMessage, HTTP_STATUS_BAD_REQUEST)
        }
        req.params = { ...req.params, ...result.data }
        next()
    }
}
