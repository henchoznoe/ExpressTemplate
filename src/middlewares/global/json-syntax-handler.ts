/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/global/json-syntax-handler.ts
 * @title JSON Syntax Error Handler
 * @description Middleware to handle JSON syntax errors.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'

// --- Constants ---
const HTTP_STATUS_BAD_REQUEST = 400
const MSG_INVALID_JSON = 'Invalid JSON: The request body is malformed.'

export const handleJsonSyntaxError = (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err && err.status === HTTP_STATUS_BAD_REQUEST && 'body' in err) {
        return next(new AppError(MSG_INVALID_JSON, HTTP_STATUS_BAD_REQUEST))
    }
    return next(err)
}
