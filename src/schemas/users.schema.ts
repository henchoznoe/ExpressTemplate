/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/users.schema.ts
 * @title User Validation Schemas
 * @description Defines Zod schemas for validating user-related request bodies (create, update).
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { EmailSchema, NameSchema, PasswordSchema } from '@schemas/common.schema.js'
import { z } from 'zod/v4'

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

export const CreateUserSchema = z
    .object({
        email: EmailSchema,
        name: NameSchema,
        password: PasswordSchema,
    })
    .strict()
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = z
    .object({
        email: EmailSchema.optional(),
        name: NameSchema.optional(),
        password: PasswordSchema.optional(),
    })
    .strict()
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>
