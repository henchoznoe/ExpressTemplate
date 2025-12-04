/**
 * @file src/routes/users.route.ts
 * @title User API Routes
 * @description This file defines all API routes related to user management.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { prisma } from '@config/prisma.js'
import { UserController } from '@controllers/users.controller.js'
import { PrismaUsersRepository } from '@db/prisma-users.repository.js'
import { protect } from '@middlewares/route/auth.middleware.js'
import {
    validateBody,
    validateParams,
    validateQuery,
} from '@middlewares/route/validate-request.js'
import { PATH_ID, PATH_ROOT } from '@routes/paths.js'
import { IdParamSchema, PaginationSchema } from '@schemas/common.schema.js'
import { UserService } from '@services/users/users.service.js'
import { Router } from 'express'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/auth.schema.js'

export const usersRouter = Router()

const userRepository = new PrismaUsersRepository(prisma)
const userService = new UserService(userRepository)
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
