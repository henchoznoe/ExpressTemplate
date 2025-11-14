/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/validations/validate-fields.ts
 * @title Zod Validation Middleware
 * @description Provides a factory function to create Zod validation middlewares.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import type { ZodError, ZodObject } from 'zod'

// --- Constants ---
const HTTP_STATUS_BAD_REQUEST = 400

const formatValidationErrors = (error: ZodError): string => {
    const firstIssue = error.issues[0]
    return firstIssue?.message || 'Invalid input'
}

export const validateFields = (schema: ZodObject) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            const errorMessage = formatValidationErrors(result.error)
            throw new AppError(errorMessage, HTTP_STATUS_BAD_REQUEST)
        }
        req.body = result.data
        next()
    }
}
