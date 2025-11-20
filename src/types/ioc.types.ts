/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/types/ioc.types.ts
 * @title IoC Types
 * @description Defines unique symbols for Dependency Injection binding identifiers.
 * @last-modified 2025-11-20
 */

export const TYPES = {
    AuthController: Symbol.for('AuthController'),
    AuthService: Symbol.for('AuthService'),
    MailService: Symbol.for('MailService'),
    PrismaClient: Symbol.for('PrismaClient'),
    UserController: Symbol.for('UserController'),
    UserRepository: Symbol.for('UserRepository'),
    UserService: Symbol.for('UserService'),
}
