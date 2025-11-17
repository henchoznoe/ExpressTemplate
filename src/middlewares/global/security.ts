/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/global/security.ts
 * @title Security Middlewares Configuration
 * @description This file aggregates and configures all essential security middlewares.
 * @last-modified 2025-11-17
 */

import { config } from '@config/env.js'
import { handleJsonSyntaxError } from '@middlewares/global/json-syntax-handler.js'
import { sendError } from '@utils/http-responses.js'
import compression from 'compression'
import cors from 'cors'
import express, { type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

// --- Constants ---

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS_GENERAL = 200
const JSON_BODY_SIZE_LIMIT = '2mb'

/**
 * Custom handler for when the rate limit is exceeded.
 * Sends a standardized 429 error response.
 * @param _ - The Express Request object (unused).
 * @param res - The Express Response object.
 */
export const handleRateLimitExceeded = (_: Request, res: Response) => {
    sendError(
        res,
        StatusCodes.TOO_MANY_REQUESTS,
        getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
    )
}

/**
 * An array of configured security middlewares, ready to be applied to the app.
 * The order in this array is the order they will be applied.
 */
export const securityMiddlewares = [
    // 1. Basic Rate Limiting
    // Protects against brute-force and DoS attacks by limiting request frequency.
    rateLimit({
        handler: handleRateLimitExceeded,
        limit: RATE_LIMIT_MAX_REQUESTS_GENERAL,
        windowMs: RATE_LIMIT_WINDOW_MS,
    }),

    // 2. Helmet
    // Sets various HTTP headers to secure the app (e.g., CSP, X-Content-Type-Options).
    helmet(),

    // 3. HPP (HTTP Parameter Pollution)
    // Protects against parameter pollution attacks (e.g., ?id=1&id=2).
    hpp(),

    // 4. JSON Body Parser
    // Parses incoming JSON requests with a defined size limit to prevent large payloads.
    express.json({ limit: JSON_BODY_SIZE_LIMIT }),
    handleJsonSyntaxError,

    // 5. CORS (Cross-Origin Resource Sharing)
    // Configures which external domains, methods, and headers are allowed to access the API.
    cors({
        allowedHeaders: config.corsAllowedHeaders,
        methods: config.corsMethods,
        origin: config.corsOrigin,
    }),

    // 6. Compression
    // Compresses response bodies (e.g., with gzip) for better performance.
    compression(),
]
