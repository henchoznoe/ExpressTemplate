/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/common.schema.ts
 * @title Common Validation Schemas
 * @description Defines Zod schemas for common validations.
 * @last-modified 2025-11-17
 */

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

// --- Constants ---
const NAME_MIN = 1
const NAME_MAX = 100
const PASSWORD_MIN = 8
const PASSWORD_MAX = 100
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])[\s\S]*$/

const MAIL_INVALID = 'Invalid email address'
const NAME_MIN_ERR = 'Name is required'
const NAME_MAX_ERR = `Name must be ≤ ${NAME_MAX} characters`
const PASSWORD_MIN_ERR = `Password must be at least ${PASSWORD_MIN} characters`
const PASSWORD_MAX_ERR = `Password must be ≤ ${PASSWORD_MAX} characters`
const PASSWORD_INVALID =
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
const MSG_INVALID_ID = 'Invalid ID format (must be a UUID)'

export const PAGINATION_PAGE_DEFAULT = 1
export const PAGINATION_LIMIT_DEFAULT = 10
export const PAGINATION_PAGE_MIN = 1
export const PAGINATION_LIMIT_MIN = 1
export const PAGINATION_LIMIT_MAX = 100

const PAGINATION_PAGE_MIN_ERR = `Page must be greater than or equal to ${PAGINATION_PAGE_MIN}`
const PAGINATION_LIMIT_MIN_ERR = `Limit must be greater than or equal to ${PAGINATION_LIMIT_MIN}`
const PAGINATION_LIMIT_MAX_ERR = `Limit must be less than or equal to ${PAGINATION_LIMIT_MAX}`

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

export const PaginationSchema = z.object({
    limit: z.coerce
        .number()
        .int()
        .min(PAGINATION_LIMIT_MIN, { message: PAGINATION_LIMIT_MIN_ERR })
        .max(PAGINATION_LIMIT_MAX, { message: PAGINATION_LIMIT_MAX_ERR })
        .default(PAGINATION_LIMIT_DEFAULT),
    page: z.coerce
        .number()
        .int()
        .min(PAGINATION_PAGE_MIN, { message: PAGINATION_PAGE_MIN_ERR })
        .default(PAGINATION_PAGE_DEFAULT),
})
export type PaginationSchemaType = z.infer<typeof PaginationSchema>
