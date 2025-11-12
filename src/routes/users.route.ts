/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/users.route.ts
 * @title User API Routes
 * @description This file defines all API routes related to user management.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import * as usersCtrl from '@controllers/users.controller.js'
import { protect } from '@middlewares/auth.middleware.js'
import { validateFields } from '@middlewares/validations/validate-fields.js'
import { Router } from 'express'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/users.schema.js'

// --- Router Setup ---

// Create a new Express router instance for user-related routes
const usersRouter = Router()

// --- Public routes ---

// POST /users
// Create a new user. Applies validation middleware first.
usersRouter.post('/', validateFields(CreateUserSchema), usersCtrl.createUser)

// --- Protected routes ---

// Protect all routes below this line with authentication
usersRouter.use(protect)

// GET /users
// Get all users
usersRouter.get('/', usersCtrl.getAllUsers)

// GET /users/:id
// Get a single user by their ID
usersRouter.get('/:id', usersCtrl.getUserById)

// PUT /users
// Update an existing user. Applies validation middleware first.
usersRouter.put('/', validateFields(UpdateUserSchema), usersCtrl.updateUser)

// DELETE /users/:id
// Delete a user by their ID
usersRouter.delete('/:id', usersCtrl.deleteUser)

// --- Export ---
export default usersRouter
