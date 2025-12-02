/**
 * @file src/models/user.model.ts
 * @title User Domain Models
 * @description Defines the core User data structures for the application derived from the Prisma schema.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import type {
    RefreshToken as PrismaRefreshToken,
    User as PrismaUser,
} from '../../prisma/generated/client.js'

// Represents the public-facing data for a User.
export type User = Omit<PrismaUser, 'password'>

// Represents a User including internal data (e.g., hashed password).
export type UserWithPassword = PrismaUser

// Export RefreshToken type
export type RefreshToken = PrismaRefreshToken

// Additional domain models related to User can be added here as needed.
