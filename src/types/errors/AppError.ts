/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/types/errors/AppError.ts
 * @title Custom Application Error Class
 * @description Defines a custom Error class for handling operational errors.
 * @last-modified 2025-11-16
 */

// --- Constants ---

// Default HTTP status code to use if none is provided.
const DEFAULT_ERROR_STATUS = 500
// Default flag for operational errors.
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
     * @param message - The error message, safe to send to the client.
     * @param status - The HTTP status code. Defaults to 500.
     * @param isOperational - Whether this is an operational error. Defaults to true.
     * @param data - Optional additional data related to the error.
     */
    constructor(
        message: string,
        status = DEFAULT_ERROR_STATUS,
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
