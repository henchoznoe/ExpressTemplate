/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/schemas/auth.schema.ts
 * @title Auth Validation Schemas
 * @description Defines Zod schemas for validating authentication request bodies.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z)

// --- Schemas ---

/**
 * Schema for validating the request body when logging in.
 * // TODO : Migrate to Zod v4
 */
export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().nonempty(),
})

/**
 * TypeScript type inferred from the LoginSchema.
 */
export type LoginSchemaType = z.infer<typeof LoginSchema>
