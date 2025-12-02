/**
 * @file src/utils/zod-error-formatter.ts
 * @title Zod Error Formatter
 * @description Utility function to format Zod validation errors into a clean array of objects.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import type { ZodError } from 'zod'

/**
 * Formats a ZodError into an array of objects containing field names and messages.
 * @param error - The ZodError to format.
 */
export const formatZodError = (error: ZodError) => {
    return error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
    }))
}
