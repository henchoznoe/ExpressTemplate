/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/models/user.model.ts
 * @title User Domain Models
 * @description Defines the core User data structures for the application derived from the Prisma schema.
 * @last-modified 2025-11-20
 */

import type {
    RefreshToken as PrismaRefreshToken,
    User as PrismaUser,
} from '@prisma/client'

// Represents the public-facing data for a User.
export type User = Omit<
    PrismaUser,
    | 'password'
    | 'verificationToken'
    | 'passwordResetToken'
    | 'passwordResetExpires'
>

// Represents a User including internal data (e.g., hashed password).
export type UserWithPassword = PrismaUser

// Export RefreshToken type
export type RefreshToken = PrismaRefreshToken

// Additional domain models related to User can be added here as needed.
