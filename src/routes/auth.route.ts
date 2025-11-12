/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/auth.route.ts
 * @title Auth API Routes
 * @description Defines all API routes related to authentication (login, etc.).
 * @last-modified 2025-11-12
 */

// --- Imports ---
import * as authCtrl from '@controllers/auth.controller.js'
import { validateFields } from '@middlewares/validations/validate-fields.js'
import { LoginSchema } from '@schemas/auth.schema.js'
import { Router } from 'express'

// --- Router Setup ---

// Create a new Express router instance for auth-related routes
const authRouter = Router()

// POST /auth/login
// Log in a user and get a token.
authRouter.post('/login', validateFields(LoginSchema), authCtrl.login)

// --- Export ---
export default authRouter
