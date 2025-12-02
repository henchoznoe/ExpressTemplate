/**
 * @file src/config/prisma.ts
 * @title Prisma Client Singleton
 * @description Initializes and exports the singleton Prisma client instance.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { PrismaClient } from '@prisma/client'

// --- Singleton ---

/**
 * The singleton Prisma client instance.
 * This client should be imported by any service or repository
 * needing database access.
 */
export const prisma = new PrismaClient()
