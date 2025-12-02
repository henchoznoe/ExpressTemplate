/**
 * @file src/config/container.ts
 * @title Inversify IoC Container Configuration
 * @description Sets up dependency injection bindings using InversifyJS.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { prisma } from '@config/prisma.js'
import { AuthController } from '@controllers/auth.controller.js'
import { UserController } from '@controllers/users.controller.js'
import { PrismaUsersRepository } from '@db/prisma-users.repository.js'
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { PrismaClient } from '@prisma/client'
import type { IAuthService } from '@services/auth/auth.service.interface.js'
import { AuthService } from '@services/auth/auth.service.js'
import type { IMailService } from '@services/mail/mail.service.interface.js'
import { ResendMailService } from '@services/mail/resend-mail.service.js'
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
    .bind<IMailService>(TYPES.MailService)
    .to(ResendMailService)
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
