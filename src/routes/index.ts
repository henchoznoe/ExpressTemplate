/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/index.ts
 * @title Main Application Router
 * @description This file sets up all application routes, including the health check.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import config from '@config/env.js'
import { errorLoggerMiddleware } from '@config/logger.js'
import authRouter from '@routes/auth.route.js'
import usersRouter from '@routes/users.route.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Application, Request, Response } from 'express'
import pkg from '../../package.json' with { type: 'json' }

// --- Constants ---
const ROUTE_HEALTH_CHECK = '/'
const ROUTE_USERS = '/users'
const ROUTE_AUTH = '/auth'
const MSG_HEALTH_SUCCESS = 'Health check successful'

// --- Route Setup ---

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

    // Error logging middleware (must be after all routes)
    // This catches errors passed from route handlers via next()
    app.use(errorLoggerMiddleware)
}

// --- Route Handlers ---

/**
 * Handles the health check route (GET /).
 * Responds with essential application status information.
 * @param _ - The Express Request object (unused).
 * @param res - The Express Response object.
 */
const handleHealthCheck = (_: Request, res: Response) => {
    const healthCheckData = {
        environment: config.nodeEnv,
        memory: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
        node: process.version,
        timestamp: new Date().toLocaleString(),
        uptime: `${process.uptime().toFixed(0)} seconds`,
        version: pkg.version,
    }
    sendSuccess(res, 200, MSG_HEALTH_SUCCESS, healthCheckData)
}
