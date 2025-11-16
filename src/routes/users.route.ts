/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/users.route.ts
 * @title User API Routes
 * @description This file defines all API routes related to user management.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import * as usersCtrl from '@controllers/users.controller.js'
import { protect } from '@middlewares/route/auth.middleware.js'
import { validateBody } from '@middlewares/route/validations/validate-body.js'
import { validateParams } from '@middlewares/route/validations/validate-params.js'
import { IdParamSchema } from '@schemas/common.schema.js'
import { Router } from 'express'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/users.schema.js'

// --- Router Setup ---

const usersRouter = Router()

// --- Protected routes ---

// Protect all routes below this line with authentication
usersRouter.use(protect)

// GET /users
// Get all users
usersRouter.get('/', usersCtrl.getAllUsers)

// GET /users/:id
// Get a single user by their ID
usersRouter.get('/:id', validateParams(IdParamSchema), usersCtrl.getUserById)

// POST /users
// Create a new user.
usersRouter.post('/', validateBody(CreateUserSchema), usersCtrl.createUser)

// PATCH /users
// Update a user by their ID
usersRouter.patch('/:id', validateParams(IdParamSchema), validateBody(UpdateUserSchema), usersCtrl.updateUser)

// DELETE /users/:id
// Delete a user by their ID
usersRouter.delete('/:id', validateParams(IdParamSchema), usersCtrl.deleteUser)

export default usersRouter
