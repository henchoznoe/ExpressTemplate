/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/auth.route.ts
 * @title Auth API Routes
 * @description Defines all API routes related to authentication (login, etc.).
 * @last-modified 2025-11-17
 */

import { container } from '@config/container.js'
import type { AuthController } from '@controllers/auth.controller.js'
import { handleRateLimitExceeded } from '@middlewares/global/security.js'
import { validateBody } from '@middlewares/route/validate-request.js'
import { PATH_LOGIN, PATH_REFRESH, PATH_REGISTER } from '@routes/paths.js'
import {
    LoginSchema,
    RefreshTokenSchema,
    RegisterSchema,
} from '@schemas/auth.schema.js'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { TYPES } from '@/types/ioc.types.js'

// --- Constants ---
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const AUTH_RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per window per IP

const authRateLimiter = rateLimit({
    handler: handleRateLimitExceeded,
    limit: AUTH_RATE_LIMIT_MAX_REQUESTS,
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
})

export const authRouter = Router()
const authController = container.get<AuthController>(TYPES.AuthController)

// POST /auth/register
authRouter.post(
    PATH_REGISTER,
    authRateLimiter,
    validateBody(RegisterSchema),
    authController.register,
)

// POST /auth/login
authRouter.post(
    PATH_LOGIN,
    authRateLimiter,
    validateBody(LoginSchema),
    authController.login,
)

// POST /auth/refresh
// Rotate refresh token and get a new access token.
authRouter.post(
    PATH_REFRESH,
    authRateLimiter,
    validateBody(RefreshTokenSchema),
    authController.refresh,
)
