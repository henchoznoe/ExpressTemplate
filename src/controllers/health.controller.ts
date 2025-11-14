/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/controllers/health.controller.ts
 * @title Health Check Controller
 * @description HTTP request handler for the health check route.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import config from '@config/env.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Request, Response } from 'express'
import pkg from '../../package.json' with { type: 'json' }

// --- Constants ---
const MSG_HEALTH_SUCCESS = 'Health check successful'

/**
 * Handles the health check route (GET /).
 * Responds with essential application status information.
 * @param _ - The Express Request object (unused).
 * @param res - The Express Response object.
 */
export const handleHealthCheck = (_: Request, res: Response) => {
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
