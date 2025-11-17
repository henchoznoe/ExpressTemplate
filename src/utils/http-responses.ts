/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/utils/http-responses.ts
 * @title HTTP Response Utilities
 * @description Provides standardized helper functions for sending success and error JSON responses.
 * @last-modified 2025-11-17
 */

import type { ResponseType } from '@typings/http-responses.js'
import type { Response } from 'express'

/**
 * Sends a standardized success response.
 * @param res - The Express Response object.
 * @param status - The HTTP status code (e.g., 200, 201).
 * @param message - A descriptive message for the client.
 * @param data - An optional data object to include in the response.
 */
export const sendSuccess = (
    res: Response,
    status: number,
    message: string,
    data: object | null = {},
) => {
    res.status(status).json({ data, message, success: true } as ResponseType)
}

/**
 * Sends a standardized error response.
 * @param res - The Express Response object.
 * @param status - The HTTP status code (e.g., 400, 404, 500).
 * @param message - A descriptive error message for the client.
 * @param data - An optional object containing error details (e.g., validation issues).
 */
export const sendError = (
    res: Response,
    status: number,
    message: string,
    data: object | null = {},
) => {
    res.status(status).json({ data, message, success: false } as ResponseType)
}
