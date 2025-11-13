/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/users.schema.ts
 * @title User Validation Schemas
 * @description Defines Zod schemas for validating user-related request bodies (create, update).
 * @last-modified 2025-11-13
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import zod, { z } from 'zod'

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

/**
 * Schema for validating the request body when creating a new user.
 * // TODO : Migrate to Zod v4
 */
export const CreateUserSchema = z.object({
    email: z.email(),
    name: z.string().nonempty(),
    password: z.string().nonempty(),
})

export type CreateUserSchemaType = zod.infer<typeof CreateUserSchema>

/**
 * Schema for validating the request body when **updating** an existing user.
 * All fields are optional, but the 'id' is required for the operation.
 * // TODO : Migrate to Zod v4
 */
export const UpdateUserSchema = zod.object({
    email: z.email().optional(),
    name: z.string().optional(),
    password: z.string().optional(),
})

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>
