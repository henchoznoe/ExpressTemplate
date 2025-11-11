/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/index.ts
 * @title Core Middleware Orchestrator
 * @description This file exports a single function to apply all core middlewares to the Express app.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import { applyRequestLogger } from '@middlewares/global/request-logger.js'
import { securityMiddlewares } from '@middlewares/global/security.js'
import type { Application } from 'express'

// --- Middleware Setup ---

/**
 * Applies all core middlewares to the Express application instance.
 * The order is important: security middlewares run before logging.
 *
 * @param app - The main Express application instance.
 */
export const setupMiddlewares = (app: Application) => {
    // 1. Security Middlewares
    // Apply core security protections (CORS, Helmet, Rate Limiter, etc.) first.
    for (const middleware of securityMiddlewares) {
        app.use(middleware)
    }

    // 2. Request Logger
    // Apply the request logger (Morgan) after security.
    applyRequestLogger(app)
}
