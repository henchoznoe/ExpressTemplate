/**
 * @file src/types/ioc.types.ts
 * @title IoC Types
 * @description Defines unique symbols for Dependency Injection binding identifiers.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
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
