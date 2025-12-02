/**
 * @file src/docs/paths/auth.paths.ts
 * @title Auth OpenAPI Path Definitions
 * @description Registers all authentication-related API paths for OpenAPI documentation.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import {
    PATH_LOGIN,
    PATH_REFRESH,
    PATH_REGISTER,
    ROUTE_AUTH,
    TAG_AUTH,
} from '@routes/paths.js'
import {
    LoginSchema,
    RefreshTokenSchema,
    RegisterSchema,
} from '@schemas/auth.schema.js'
import { StatusCodes } from 'http-status-codes'

// --- Constants ---
const PATH_AUTH_REGISTER = `${ROUTE_AUTH}${PATH_REGISTER}`
const PATH_AUTH_LOGIN = `${ROUTE_AUTH}${PATH_LOGIN}`
const PATH_AUTH_REFRESH = `${ROUTE_AUTH}${PATH_REFRESH}`

const METHOD_POST = 'post'
const MIME_TYPE_JSON = 'application/json'

// --- Descriptions ---
const DESC_REGISTER = 'Register a new user (Sends verification email)'
const DESC_LOGIN = 'Log in a user'
const DESC_REFRESH = 'Refresh access token'

// --- Responses ---
const RESP_201_REGISTER = 'Registration successful. Please check your email.'
const RESP_200_LOGIN = 'Login successful'
const RESP_200_REFRESH = 'Token refreshed successfully'

const RESP_400 = 'Validation error or invalid token'
const RESP_401_LOGIN = 'Invalid email, password or email not verified'
const RESP_401_REFRESH = 'Invalid or expired refresh token'
const RESP_409_EMAIL = 'Email already in use'
const RESP_429 = 'Too many requests'
const RESP_500 = 'Internal server error'

/**
 * Registers all auth-related paths with the OpenAPI registry.
 * @param registry - The main OpenAPI registry instance.
 */
export const registerAuthPaths = (registry: OpenAPIRegistry) => {
    // 1. Register POST /auth/register
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
            [StatusCodes.TOO_MANY_REQUESTS]: { description: RESP_429 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })

    // 2. Login POST /auth/login
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
            [StatusCodes.TOO_MANY_REQUESTS]: { description: RESP_429 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })

    // 3. Refresh Access Token
    registry.registerPath({
        description: DESC_REFRESH,
        method: METHOD_POST,
        path: PATH_AUTH_REFRESH,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: RefreshTokenSchema,
                    },
                },
            },
        },
        responses: {
            [StatusCodes.OK]: { description: RESP_200_REFRESH },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.UNAUTHORIZED]: { description: RESP_401_REFRESH },
            [StatusCodes.TOO_MANY_REQUESTS]: { description: RESP_429 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })
}
