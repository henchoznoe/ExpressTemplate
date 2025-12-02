/**
 * @file src/middlewares/index.ts
 * @title Core Middleware Orchestrator
 * @description This file exports a single function to apply all core middlewares to the Express app.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { applyRequestLogger } from '@middlewares/global/logger.js'
import { securityMiddlewares } from '@middlewares/global/security.js'
import type { Application } from 'express'

/**
 * Applies all core middlewares to the Express application instance.
 * The order is important: security middlewares run before logging.
 *
 * @param app - The main Express application instance.
 */
export const setupMiddlewares = (app: Application) => {
    // 1. Security Middlewares
    for (const middleware of securityMiddlewares) app.use(middleware)
    // 2. Request Logger
    applyRequestLogger(app)
}
