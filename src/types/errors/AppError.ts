/**
 * @file src/types/errors/AppError.ts
 * @title Custom Application Error Class
 * @description Defines a custom Error class for handling operational errors.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

// --- Constants ---
const DEFAULT_OPERATIONAL_FLAG = true

/**
 * Custom error class for handling "operational" errors.
 * Operational errors are expected errors (e.g., "User not found", "Invalid input")
 * that don't mean the application is in a broken state.
 * This allows the global error handler to differentiate them from programming errors.
 */
export class AppError extends Error {
    // The HTTP status code (e.g., 400, 404, 500) associated with this error.
    public status: number
    // A flag to indicate if this is an operational error (true) or a programming error (false).
    public isOperational: boolean
    // Optional additional data related to the error.
    public data: object | null

    /**
     * Creates a new operational error.
     * @param message - The error message, safe to send to the client. Defaults to the standard message for status 500.
     * @param status - The HTTP status code. Defaults to 500.
     * @param isOperational - Whether this is an operational error. Defaults to true.
     * @param data - Optional additional data related to the error.
     */
    constructor(
        message: string = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        status = StatusCodes.INTERNAL_SERVER_ERROR,
        isOperational = DEFAULT_OPERATIONAL_FLAG,
        data: object | null = null,
    ) {
        // Call the parent Error constructor
        super(message)

        // Set custom properties
        this.status = status
        this.isOperational = isOperational
        this.data = data

        // Restore the prototype chain, essential for built-in classes like Error.
        Object.setPrototypeOf(this, new.target.prototype)

        // Capture the stack trace, excluding the constructor from it.
        Error.captureStackTrace(this)
    }
}
