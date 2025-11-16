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
import { validateBody } from '@middlewares/route/validations/validate-body.js'
import { LoginSchema, RegisterSchema } from '@schemas/auth.schema.js'
import { Router } from 'express'

// --- Router Setup ---

const authRouter = Router()

// --- Public routes ---

// POST /auth/register
// Register a new user.
authRouter.post('/register', validateBody(RegisterSchema), authCtrl.register)

// POST /auth/login
// Log in a user and get a token.
authRouter.post('/login', validateBody(LoginSchema), authCtrl.login)

export default authRouter
