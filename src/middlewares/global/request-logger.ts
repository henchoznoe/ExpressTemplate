/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/global/request-logger.ts
 * @title Request Logger Middleware
 * @description Applies the Morgan/Winston request logger to the Express app.
 * @last-modified 2025-11-17
 */

import { setupLogger } from '@config/logger.js'
import type { Application } from 'express'

/**
 * Applies the configured request logger (Morgan) to the Express app.
 * This wrapper function exists to keep the middleware orchestration clean
 * in `src/middlewares/index.ts`.
 *
 * @param app - The main Express application instance.
 */
export const applyRequestLogger = (app: Application) => {
    setupLogger(app)
}
