/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/users.schema.ts
 * @title User Validation Schemas
 * @description Defines Zod schemas for validating user-related request bodies (create, update).
 * @last-modified 2025-11-11
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import zod, { z } from 'zod'

// --- Constants ---

// Validation rules
const MIN_NAME_LENGTH = 2
const MIN_PASSWORD_LENGTH = 6

// Validation error messages
const ERROR_MSG_INVALID_EMAIL = 'Invalid email address'
const ERROR_MSG_NAME_MIN_LENGTH = `Name must be at least ${MIN_NAME_LENGTH} characters long`
const ERROR_MSG_PASSWORD_MIN_LENGTH = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
const ERROR_MSG_INVALID_USER_ID = 'Invalid user ID'

// OpenAPI metadata
const OPENAPI_DESC_EMAIL = 'User email'
const OPENAPI_DESC_FULL_NAME = 'Full name'
const OPENAPI_DESC_PASSWORD = 'Password'
const OPENAPI_DESC_USER_ID = 'User ID'
const OPENAPI_SCHEMA_NAME_CREATE = 'CreateUser'
const OPENAPI_SCHEMA_NAME_UPDATE = 'UpdateUser'

// --- OpenAPI Setup ---

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

// --- Schemas ---

/**
 * Schema for validating the request body when creating a new user.
 */
export const CreateUserSchema = z
    .object({
        email: z.email(ERROR_MSG_INVALID_EMAIL).openapi({ description: OPENAPI_DESC_EMAIL }),
        name: z
            .string()
            .min(MIN_NAME_LENGTH, ERROR_MSG_NAME_MIN_LENGTH)
            .openapi({ description: OPENAPI_DESC_FULL_NAME }),
        password: z
            .string()
            .min(MIN_PASSWORD_LENGTH, ERROR_MSG_PASSWORD_MIN_LENGTH)
            .openapi({ description: OPENAPI_DESC_PASSWORD }),
    })
    .openapi(OPENAPI_SCHEMA_NAME_CREATE)

/**
 * TypeScript type inferred from the CreateUserSchema.
 */
export type CreateUserSchemaType = zod.infer<typeof CreateUserSchema>

/**
 * Schema for validating the request body when **updating** an existing user.
 * All fields are optional, but the 'id' is required for the operation.
 */
export const UpdateUserSchema = zod
    .object({
        email: z.email(ERROR_MSG_INVALID_EMAIL).optional().openapi({ description: OPENAPI_DESC_EMAIL }),
        id: z.uuid(ERROR_MSG_INVALID_USER_ID).openapi({ description: OPENAPI_DESC_USER_ID }),
        name: z
            .string()
            .min(MIN_NAME_LENGTH, ERROR_MSG_NAME_MIN_LENGTH)
            .optional()
            .openapi({ description: OPENAPI_DESC_FULL_NAME }),
        password: z
            .string()
            .min(MIN_PASSWORD_LENGTH, ERROR_MSG_PASSWORD_MIN_LENGTH)
            .optional()
            .openapi({ description: OPENAPI_DESC_PASSWORD }),
    })
    .openapi(OPENAPI_SCHEMA_NAME_UPDATE)

/**
 * TypeScript type inferred from the UpdateUserSchema.
 */
export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>
