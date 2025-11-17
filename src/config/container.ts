/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/container.ts
 * @title Inversify IoC Container Configuration
 * @description Sets up dependency injection bindings using InversifyJS.
 * @last-modified 2025-11-17
 */

import { AuthController } from '@controllers/auth.controller.js'
import { UserController } from '@controllers/users.controller.js'
// Implementations
import { PrismaUsersRepository } from '@db/prisma-users.repository.js'
// Interfaces
import type { IUserRepository } from '@db/users.repository.interface.js'
import { AuthService } from '@services/auth.service.js'
import { UserService } from '@services/users.service.js'
import { Container } from 'inversify'
import { TYPES } from '@/types/ioc.types.js'

const container = new Container()

// Bindings
container
    .bind<IUserRepository>(TYPES.UserRepository)
    .to(PrismaUsersRepository)
    .inSingletonScope()
container
    .bind<AuthService>(TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope()
container
    .bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope()
container
    .bind<AuthController>(TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope()
container
    .bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inSingletonScope()

export { container }
