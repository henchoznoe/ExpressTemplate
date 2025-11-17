/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/index.ts
 * @title Main Application Router
 * @description This file sets up all application routes, including the health check.
 * @last-modified 2025-11-17
 */

import { handleHealthCheck } from '@controllers/health.controller.js'
import { authRouter } from '@routes/auth.route.js'
import { ROUTE_AUTH, ROUTE_HEALTH, ROUTE_USERS } from '@routes/paths.js'
import { usersRouter } from '@routes/users.route.js'
import type { Application } from 'express'

/**
 * Mounts all application routes onto the Express app instance.
 * @param app - The main Express application instance.
 */
export const setupRoutes = (app: Application): void => {
    app.get(ROUTE_HEALTH, handleHealthCheck)
    app.use(ROUTE_AUTH, authRouter)
    app.use(ROUTE_USERS, usersRouter)
    // Additional routes can be mounted here
}
