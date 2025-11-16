/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/auth.schema.ts
 * @title Auth Validation Schemas
 * @description Defines Zod schemas for validating authentication request bodies.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { EmailSchema, NameSchema, PasswordSchema } from '@schemas/common.schema.js'
import { z } from 'zod/v4'

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

export const RegisterSchema = z
    .object({
        email: EmailSchema,
        name: NameSchema,
        password: PasswordSchema,
    })
    .strict()
export type RegisterSchemaType = z.infer<typeof RegisterSchema>

export const LoginSchema = z
    .object({
        email: EmailSchema,
        password: PasswordSchema,
    })
    .strict()
export type LoginSchemaType = z.infer<typeof LoginSchema>
