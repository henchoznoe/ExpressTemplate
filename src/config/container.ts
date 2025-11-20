/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/container.ts
 * @title Inversify IoC Container Configuration
 * @description Sets up dependency injection bindings using InversifyJS.
 * @last-modified 2025-11-20
 */

// Database
import { prisma } from '@config/prisma.js'
import { AuthController } from '@controllers/auth.controller.js'
import { UserController } from '@controllers/users.controller.js'
// Implementations
import { PrismaUsersRepository } from '@db/prisma-users.repository.js'
// Interfaces
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { PrismaClient } from '@prisma/client'
import type { IAuthService } from '@services/auth/auth.service.interface.js'
import { AuthService } from '@services/auth/auth.service.js'
import type { IUserService } from '@services/users/users.service.interface.js'
import { UserService } from '@services/users/users.service.js'
import { Container } from 'inversify'
import { TYPES } from '@/types/ioc.types.js'

const container = new Container()

// --- Database Bindings ---
// Bind the Prisma instance as a constant value since it's a singleton.
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma)

// --- Repository Bindings ---
container
    .bind<IUserRepository>(TYPES.UserRepository)
    .to(PrismaUsersRepository)
    .inSingletonScope()

// --- Service Bindings ---
container
    .bind<IAuthService>(TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope()
container
    .bind<IUserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope()

// --- Controller Bindings ---
container
    .bind<AuthController>(TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope()
container
    .bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inSingletonScope()

export { container }
