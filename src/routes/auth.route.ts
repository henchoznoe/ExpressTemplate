/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/auth.route.ts
 * @title Auth API Routes
 * @description Defines all API routes related to authentication (login, etc.).
 * @last-modified 2025-11-14
 */

// --- Imports ---
import * as authCtrl from '@controllers/auth.controller.js'
import { handleRateLimitExceeded } from '@middlewares/global/security.js'
import { validateBody } from '@middlewares/route/validations/validate-body.js'
import { LoginSchema, RegisterSchema } from '@schemas/auth.schema.js'
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

// --- Router Setup ---

const authRouter = Router()

// --- Public routes ---

// POST /auth/register
// Register a new user.
authRouter.post('/register', authRateLimiter, validateBody(RegisterSchema), authCtrl.register)

// POST /auth/login
// Log in a user and get a token.
authRouter.post('/login', authRateLimiter, validateBody(LoginSchema), authCtrl.login)

export default authRouter
