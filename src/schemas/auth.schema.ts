/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/auth.schema.ts
 * @title Auth Validation Schemas
 * @description Defines Zod schemas for validating authentication request bodies.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod/v4'

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

export const EmailSchema = z
    .preprocess(
        val => (typeof val === 'string' ? val.trim().toLowerCase() : val),
        z.email({ error: 'Invalid email address' }),
    )
    .openapi('Email')

export const NameSchema = z
    .string()
    .trim()
    .min(1, { error: 'Name is required' })
    .max(100, { error: `Name must be ≤ 100 characters` })
    .openapi('Name')

export const PasswordSchema = z
    .string()
    .min(8, { error: `Password must be at least 8 characters` })
    .regex(/^[\s\S]*$/, { error: 'Password invalid' })
    .openapi('Password')

export const RegisterSchema = z
    .object({
        email: EmailSchema,
        name: NameSchema,
        password: PasswordSchema,
    })
    .strict()
    .openapi('RegisterRequest')

export type RegisterSchemaType = z.infer<typeof RegisterSchema>

export const LoginSchema = z
    .object({
        email: EmailSchema,
        password: PasswordSchema,
    })
    .strict()
    .openapi('LoginRequest')

export type LoginSchemaType = z.infer<typeof LoginSchema>
