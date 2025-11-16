/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/docs/paths/auth.paths.ts
 * @title Auth OpenAPI Path Definitions
 * @description Registers all authentication-related API paths for OpenAPI documentation.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { LoginSchema, RegisterSchema } from '@schemas/auth.schema.js'

// --- Constants ---
const TAGS_AUTH = ['auth']

// Paths
const PATH_AUTH = '/auth'
const PATH_AUTH_REGISTER = `${PATH_AUTH}/register`
const PATH_AUTH_LOGIN = `${PATH_AUTH}/login`

// Methods
const METHOD_POST = 'post'

// Content Type
const MIME_TYPE_JSON = 'application/json'

// Descriptions
const DESC_REGISTER = 'Register a new user'
const DESC_LOGIN = 'Log in a user'

// Response Descriptions
const RESP_201_REGISTER = 'Registration successful'
const RESP_200_LOGIN = 'Login successful'
const RESP_400 = 'Validation error'
const RESP_401_LOGIN = 'Invalid email or password'
const RESP_409_EMAIL = 'Email already in use'
const RESP_500 = 'Internal server error'

/**
 * Registers all auth-related paths with the OpenAPI registry.
 * @param registry - The main OpenAPI registry instance.
 */
export const registerAuthPaths = (registry: OpenAPIRegistry) => {
    // Register POST /auth/register
    registry.registerPath({
        description: DESC_REGISTER,
        method: METHOD_POST,
        path: PATH_AUTH_REGISTER,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: RegisterSchema,
                    },
                },
            },
        },
        responses: {
            201: { description: RESP_201_REGISTER },
            400: { description: RESP_400 },
            409: { description: RESP_409_EMAIL },
            500: { description: RESP_500 },
        },
        tags: TAGS_AUTH,
    })

    // Register POST /auth/login
    registry.registerPath({
        description: DESC_LOGIN,
        method: METHOD_POST,
        path: PATH_AUTH_LOGIN,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: LoginSchema,
                    },
                },
            },
        },
        responses: {
            200: { description: RESP_200_LOGIN },
            400: { description: RESP_400 },
            401: { description: RESP_401_LOGIN },
            500: { description: RESP_500 },
        },
        tags: TAGS_AUTH,
    })

    // Additional auth-related paths can be registered here
}
