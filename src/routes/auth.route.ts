/**
 * @file src/routes/auth.route.ts
 * @title Auth API Routes
 * @description Defines all API routes related to authentication (login, etc.).
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { prisma } from '@config/prisma.js'
import { AuthController } from '@controllers/auth.controller.js'
import { PrismaUsersRepository } from '@db/prisma-users.repository.js'
import { handleRateLimitExceeded } from '@middlewares/global/security.js'
import { validateBody } from '@middlewares/route/validate-request.js'
import { PATH_LOGIN, PATH_REFRESH, PATH_REGISTER } from '@routes/paths.js'
import {
    LoginSchema,
    RefreshTokenSchema,
    RegisterSchema,
} from '@schemas/auth.schema.js'
import { AuthService } from '@services/auth/auth.service.js'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'

// --- Constants ---
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const AUTH_RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per window per IP

const authRateLimiter = rateLimit({
    handler: handleRateLimitExceeded,
    limit: AUTH_RATE_LIMIT_MAX_REQUESTS,
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
})

export const authRouter = Router()

const userRepository = new PrismaUsersRepository(prisma)
const authService = new AuthService(userRepository)
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

// POST /auth/refresh
// Rotate refresh token and get a new access token.
authRouter.post(
    PATH_REFRESH,
    authRateLimiter,
    validateBody(RefreshTokenSchema),
    authController.refresh,
)
