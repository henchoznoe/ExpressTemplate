/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/routes/users.route.ts
 * @title User API Routes
 * @description This file defines all API routes related to user management.
 * @last-modified 2025-11-17
 */

import { UserController } from '@controllers/users.controller.js'
import { protect } from '@middlewares/route/auth.middleware.js'
import { validateBody } from '@middlewares/route/validations/validate-body.js'
import { validateParams } from '@middlewares/route/validations/validate-params.js'
import { validateQuery } from '@middlewares/route/validations/validate-query.js'
import { PATH_ID, PATH_ROOT } from '@routes/paths.js'
import { IdParamSchema, PaginationSchema } from '@schemas/common.schema.js'
import { Router } from 'express'
import { userService } from '@/dependencies.js'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/auth.schema.js'

export const usersRouter = Router()
const userController = new UserController(userService)

// Protect all routes below this line with authentication
usersRouter.use(protect)

// GET /users
// Pagination /users?page=1&limit=10
usersRouter.get(
    PATH_ROOT,
    validateQuery(PaginationSchema),
    userController.getAllUsers,
)

// GET /users/:id
usersRouter.get(
    PATH_ID,
    validateParams(IdParamSchema),
    userController.getUserById,
)

// POST /users

usersRouter.post(
    PATH_ROOT,
    validateBody(CreateUserSchema),
    userController.createUser,
)

// PATCH /users
usersRouter.patch(
    PATH_ID,
    validateParams(IdParamSchema),
    validateBody(UpdateUserSchema),
    userController.updateUser,
)

// DELETE /users/:id
usersRouter.delete(
    PATH_ID,
    validateParams(IdParamSchema),
    userController.deleteUser,
)
