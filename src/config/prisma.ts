/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/prisma.ts
 * @title Prisma Client Singleton
 * @description Initializes and exports the singleton Prisma client instance.
 * @last-modified 2025-11-15
 */

// --- Imports ---
import { PrismaClient } from '@prisma/client'

// --- Singleton ---

/**
 * The singleton Prisma client instance.
 * This client should be imported by any service or repository
 * needing database access.
 */
export const prisma = new PrismaClient()
