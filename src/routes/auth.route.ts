/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/auth.route.ts
 * @title Auth API Routes
 * @description Defines all API routes related to authentication (login, etc.).
 * @last-modified 2025-11-17
 */

import { AuthController } from '@controllers/auth.controller.js'
import { handleRateLimitExceeded } from '@middlewares/global/security.js'
import { validateBody } from '@middlewares/route/validate-request.js'
import { PATH_LOGIN, PATH_REGISTER } from '@routes/paths.js'
import { LoginSchema, RegisterSchema } from '@schemas/auth.schema.js'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authService } from '@/dependencies.js'

// --- Constants ---
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const AUTH_RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per window per IP

const authRateLimiter = rateLimit({
    handler: handleRateLimitExceeded,
    limit: AUTH_RATE_LIMIT_MAX_REQUESTS,
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
})

export const authRouter = Router()
const authController = new AuthController(authService)

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
