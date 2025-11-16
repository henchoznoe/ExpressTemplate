/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/models/user.model.ts
 * @title User Domain Models
 * @description Defines the core User data structures for the application derived from the Prisma schema.
 * @last-modified 2025-11-16
 */

import type { User as PrismaUser } from '@prisma/client'

// Represents the public-facing data for a User.
// We use Omit to exclude the 'password' field from the Prisma-generated type.
export type User = Omit<PrismaUser, 'password'>

// Represents a User including internal data (e.g., hashed password).
// This is simply the full Prisma-generated User type.
export type UserWithPassword = PrismaUser

// Additional domain models related to User can be added here as needed.
