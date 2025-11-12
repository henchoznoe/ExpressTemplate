/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/auth.schema.ts
 * @title Auth Validation Schemas
 * @description Defines Zod schemas for validating authentication request bodies.
 * @last-modified 2025-11-12
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

// --- Constants ---

// Validation error messages
const ERROR_MSG_INVALID_EMAIL = 'Invalid email address'
const ERROR_MSG_NO_PASSWORD = 'Password is required'

// OpenAPI metadata
const OPENAPI_DESC_EMAIL = 'User email'
const OPENAPI_DESC_PASSWORD = 'Password'

// --- OpenAPI Setup ---

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

// --- Schemas ---

/**
 * Schema for validating the request body when logging in.
 */
export const LoginSchema = z.object({
    email: z.email(ERROR_MSG_INVALID_EMAIL).openapi({ description: OPENAPI_DESC_EMAIL }),
    password: z.string().nonempty(ERROR_MSG_NO_PASSWORD).openapi({ description: OPENAPI_DESC_PASSWORD }),
})

/**
 * TypeScript type inferred from the LoginSchema.
 */
export type LoginSchemaType = z.infer<typeof LoginSchema>
