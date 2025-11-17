/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/auth.schema.ts
 * @title Auth & User Validation Schemas
 * @description Defines Zod schemas for validating auth and user creation bodies.
 * @last-modified 2025-11-17
 */

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import {
    EmailSchema,
    NameSchema,
    PasswordSchema,
} from '@schemas/common.schema.js'
import { z } from 'zod'

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

// --- User Schemas ---

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

// --- Auth Schemas ---

// RegisterSchema is functionally identical to CreateUserSchema
export const RegisterSchema = CreateUserSchema
export type RegisterSchemaType = CreateUserSchemaType

export const LoginSchema = z
    .object({
        email: EmailSchema,
        password: PasswordSchema,
    })
    .strict()
export type LoginSchemaType = z.infer<typeof LoginSchema>
