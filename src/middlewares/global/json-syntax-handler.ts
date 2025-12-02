/**
 * @file src/middlewares/global/json-syntax-handler.ts
 * @title JSON Syntax Error Handler
 * @description Middleware to handle JSON syntax errors.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { AppError } from '@typings/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

// --- Constants ---
const MSG_INVALID_JSON = 'Invalid JSON: The request body is malformed.'

/**
 * Middleware to handle JSON syntax errors. If a SyntaxError is detected
 * during JSON parsing, it responds with a 400 Bad Request and a relevant message.
 * @param err - The error object.
 * @param _req - The Express Request object (unused).
 * @param _res - The Express Response object (unused).
 * @param next - The Express NextFunction to pass control to the next middleware.
 */
export const handleJsonSyntaxError = (
    err: unknown,
    _req: Request,
    _res: Response,
    next: NextFunction,
) => {
    if (
        err instanceof SyntaxError &&
        'status' in err &&
        err.status === StatusCodes.BAD_REQUEST &&
        'body' in err
    ) {
        return next(new AppError(MSG_INVALID_JSON, StatusCodes.BAD_REQUEST))
    }
    return next(err)
}
