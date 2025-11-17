/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/types/express/index.d.ts
 * @title Express Request Extension
 * @description Extends the Express Request interface to include custom properties
 * @last-modified 2025-11-17
 */

declare module 'express-serve-static-core' {
    /**
     * Extends the base Request interface.
     * The 'user' property is added by the authentication middleware after
     * successfully verifying a JWT, ensuring access to the user's ID
     * in subsequent controllers.
     */
    interface Request {
        user?: {
            id: string // The ID (UUID) of the authenticated user.
        }
        validatedQuery?: unknown
    }
}

export {}
