/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/route/validate-request.ts
 * @title Zod Request Validation Middlewares
 * @description Consolidated middlewares to validate body, params, and query using Zod.
 * @last-modified 2025-11-17
 */

import { AppError } from '@typings/errors/AppError.js'
import { formatZodError } from '@utils/zod-error-formatter.js'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { ZodObject } from 'zod'

export const validateBody = (schema: ZodObject) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            const errorDetails = formatZodError(result.error)
            const errorMessage =
                (errorDetails[0] as { message: string })?.message ||
                'Invalid request body'
            throw new AppError(errorMessage, StatusCodes.BAD_REQUEST, true, {
                issues: errorDetails,
            })
        }
        req.body = result.data
        next()
    }
}

export const validateParams = <T extends ZodObject>(schema: T) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params)
        if (!result.success) {
            const errorDetails = formatZodError(result.error)
            const errorMessage =
                (errorDetails[0] as { message: string })?.message ||
                'Invalid URL parameters'
            throw new AppError(errorMessage, StatusCodes.BAD_REQUEST, true, {
                issues: errorDetails,
            })
        }
        req.params = { ...req.params, ...result.data }
        next()
    }
}

export const validateQuery = (schema: ZodObject) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)
        if (!result.success) {
            const errorDetails = formatZodError(result.error)
            const errorMessage =
                (errorDetails[0] as { message: string })?.message ||
                'Invalid query parameters'
            throw new AppError(errorMessage, StatusCodes.BAD_REQUEST, true, {
                issues: errorDetails,
            })
        }
        req.validatedQuery = result.data
        next()
    }
}
