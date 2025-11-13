/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/types/express/index.d.ts
 * @title Express Request Extension
 * @description TODO
 * @last-modified 2025-11-13
 */

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string
        }
    }
}

export {}
