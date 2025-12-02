/**
 * @file src/schemas/auth.schema.ts
 * @title Auth & User Validation Schemas
 * @description Defines Zod schemas for validating auth and user creation bodies.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import {
    EmailSchema,
    NameSchema,
    PasswordSchema,
} from '@schemas/common.schema.js'
import { z } from 'zod'

// --- Constants ---
const REFRESH_TOKEN_MIN = 1
const REFRESH_TOKEN_MIN_ERR = 'Refresh token is required'
const TOKEN_MIN = 1
const TOKEN_ERR = 'Token is required'

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

// --- Token Schemas ---

export const RefreshTokenSchema = z
    .object({
        refreshToken: z
            .string()
            .min(REFRESH_TOKEN_MIN, { error: REFRESH_TOKEN_MIN_ERR }),
    })
    .strict()
export type RefreshTokenSchemaType = z.infer<typeof RefreshTokenSchema>

export const VerifyEmailSchema = z
    .object({
        token: z.string().min(TOKEN_MIN, { error: TOKEN_ERR }),
    })
    .strict()
export type VerifyEmailSchemaType = z.infer<typeof VerifyEmailSchema>

export const ForgotPasswordSchema = z
    .object({
        email: EmailSchema,
    })
    .strict()
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z
    .object({
        password: PasswordSchema,
        token: z.string().min(TOKEN_MIN, { error: TOKEN_ERR }),
    })
    .strict()
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>
