/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/common.schema.ts
 * @title Common Validation Schemas
 * @description Defines Zod schemas for common validations.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod/v4'

// --- Constants ---
const NAME_MIN = 1
const NAME_MAX = 100
const PASSWORD_MIN = 1
const PASSWORD_MAX = 100
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])[\s\S]*$/

const MAIL_INVALID = 'Invalid email address'
const NAME_MIN_ERR = 'Name is required'
const NAME_MAX_ERR = `Name must be ≤ ${NAME_MAX} characters`
const PASSWORD_MIN_ERR = `Password must be at least ${PASSWORD_MIN} characters`
const PASSWORD_MAX_ERR = `Password must be ≤ ${PASSWORD_MAX} characters`
const PASSWORD_INVALID =
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
const MSG_INVALID_ID = 'Invalid ID format (must be a UUID)'

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

export const IdParamSchema = z
    .object({
        id: z.uuid({ error: MSG_INVALID_ID }),
    })
    .strict()

export const EmailSchema = z.preprocess(
    val => (typeof val === 'string' ? val.trim().toLowerCase() : val),
    z.email({ error: MAIL_INVALID }),
)

export const NameSchema = z
    .string()
    .trim()
    .min(NAME_MIN, { error: NAME_MIN_ERR })
    .max(NAME_MAX, { error: NAME_MAX_ERR })

export const PasswordSchema = z
    .string()
    .min(PASSWORD_MIN, { error: PASSWORD_MIN_ERR })
    .max(PASSWORD_MAX, { error: PASSWORD_MAX_ERR })
    .regex(PASSWORD_REGEX, { error: PASSWORD_INVALID })
