/**
 * @file src/db/prisma-errors.enum.ts
 * @title Prisma Error Codes
 * @description Enumeration of common Prisma error codes used in the application.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

export enum PrismaErrorCode {
    UNIQUE_CONSTRAINT_VIOLATION = 'P2002',
    RECORD_NOT_FOUND = 'P2025',
}
