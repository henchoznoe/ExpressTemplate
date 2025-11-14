/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/index.ts
 * @title Main Application Router
 * @description This file sets up all application routes, including the health check.
 * @last-modified 2025-11-14
 */

import { handleHealthCheck } from '@controllers/health.controller.js'
// --- Imports ---
import authRouter from '@routes/auth.route.js'
import usersRouter from '@routes/users.route.js'
import type { Application } from 'express'

// --- Constants ---
const ROUTE_HEALTH_CHECK = '/'
const ROUTE_USERS = '/users'
const ROUTE_AUTH = '/auth'

/**
 * Mounts all application routes onto the Express app instance.
 * @param app - The main Express application instance.
 */
export const setupRoutes = (app: Application): void => {
    // Health check route
    app.get(ROUTE_HEALTH_CHECK, handleHealthCheck)
    // API routes
    app.use(ROUTE_AUTH, authRouter)
    app.use(ROUTE_USERS, usersRouter)
    // ... (Future routes can be added here)
}
