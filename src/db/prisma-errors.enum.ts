/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/db/prisma-errors.enum.ts
 * @title Prisma Error Codes
 * @description Enumeration of common Prisma error codes used in the application.
 * @last-modified 2025-11-17
 */

export enum PrismaErrorCode {
    UNIQUE_CONSTRAINT_VIOLATION = 'P2002',
    RECORD_NOT_FOUND = 'P2025',
}
