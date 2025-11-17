/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/docs/paths/auth.paths.ts
 * @title Auth OpenAPI Path Definitions
 * @description Registers all authentication-related API paths for OpenAPI documentation.
 * @last-modified 2025-11-17
 */

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { ROUTE_AUTH, TAG_AUTH } from '@routes/paths.js'
import { LoginSchema, RegisterSchema } from '@schemas/auth.schema.js'
import { StatusCodes } from 'http-status-codes'

// --- Constants ---
const PATH_AUTH_REGISTER = `${ROUTE_AUTH}/register`
const PATH_AUTH_LOGIN = `${ROUTE_AUTH}/login`
const METHOD_POST = 'post'
const MIME_TYPE_JSON = 'application/json'
const DESC_REGISTER = 'Register a new user'
const DESC_LOGIN = 'Log in a user'
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
            [StatusCodes.CREATED]: { description: RESP_201_REGISTER },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.CONFLICT]: { description: RESP_409_EMAIL },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })

    // Login POST /auth/login
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
            [StatusCodes.OK]: { description: RESP_200_LOGIN },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.UNAUTHORIZED]: { description: RESP_401_LOGIN },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })

    // Additional auth-related paths can be registered here
}
