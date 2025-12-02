/**
 * @file src/routes/users.route.ts
 * @title User API Routes
 * @description This file defines all API routes related to user management.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { container } from '@config/container.js'
import type { UserController } from '@controllers/users.controller.js'
import { protect } from '@middlewares/route/auth.middleware.js'
import {
    validateBody,
    validateParams,
    validateQuery,
} from '@middlewares/route/validate-request.js'
import { PATH_ID, PATH_ROOT } from '@routes/paths.js'
import { IdParamSchema, PaginationSchema } from '@schemas/common.schema.js'
import { Router } from 'express'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/auth.schema.js'
import { TYPES } from '@/types/ioc.types.js'

export const usersRouter = Router()
const userController = container.get<UserController>(TYPES.UserController)

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
