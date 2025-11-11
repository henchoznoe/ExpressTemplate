/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/types/http-responses.ts
 * @title Standard API Response Type
 * @description Defines the structure for all standardized JSON API responses.
 * @last-modified 2025-11-11
 */

// --- Type Definition ---

/**
 * Defines the standardized JSON structure for API responses.
 */
export interface ResponseType {
    /**
     * Indicates if the operation was successful.
     * true = success, false = error.
     */
    success: boolean

    /**
     * A human-readable message for the client (e.g., "User created successfully" or "User not found").
     */
    message: string

    /**
     * An optional object containing the requested data (on success)
     * or additional error details (on failure).
     */
    data?: object
}
