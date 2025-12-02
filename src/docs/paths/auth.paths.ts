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
    PATH_FORGOT_PASSWORD,
    PATH_LOGIN,
    PATH_REFRESH,
    PATH_REGISTER,
    PATH_RESET_PASSWORD,
    PATH_VERIFY_EMAIL,
    ROUTE_AUTH,
    TAG_AUTH,
} from '@routes/paths.js'
import {
    ForgotPasswordSchema,
    LoginSchema,
    RefreshTokenSchema,
    RegisterSchema,
    ResetPasswordSchema,
    VerifyEmailSchema,
} from '@schemas/auth.schema.js'
import { StatusCodes } from 'http-status-codes'

// --- Constants ---
const PATH_AUTH_REGISTER = `${ROUTE_AUTH}${PATH_REGISTER}`
const PATH_AUTH_LOGIN = `${ROUTE_AUTH}${PATH_LOGIN}`
const PATH_AUTH_REFRESH = `${ROUTE_AUTH}${PATH_REFRESH}`
const PATH_AUTH_VERIFY = `${ROUTE_AUTH}${PATH_VERIFY_EMAIL}`
const PATH_AUTH_FORGOT = `${ROUTE_AUTH}${PATH_FORGOT_PASSWORD}`
const PATH_AUTH_RESET = `${ROUTE_AUTH}${PATH_RESET_PASSWORD}`

const METHOD_POST = 'post'
const MIME_TYPE_JSON = 'application/json'

// --- Descriptions ---
const DESC_REGISTER = 'Register a new user (Sends verification email)'
const DESC_LOGIN = 'Log in a user'
const DESC_REFRESH = 'Refresh access token'
const DESC_VERIFY = 'Verify user email address'
const DESC_FORGOT = 'Request password reset link'
const DESC_RESET = 'Reset password with token'

// --- Responses ---
const RESP_201_REGISTER = 'Registration successful. Please check your email.'
const RESP_200_LOGIN = 'Login successful'
const RESP_200_REFRESH = 'Token refreshed successfully'
const RESP_200_VERIFY = 'Email verified successfully'
const RESP_200_FORGOT = 'If the email exists, a reset link has been sent'
const RESP_200_RESET = 'Password reset successfully'

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

    // 4. Verify Email
    registry.registerPath({
        description: DESC_VERIFY,
        method: METHOD_POST,
        path: PATH_AUTH_VERIFY,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: VerifyEmailSchema,
                    },
                },
            },
        },
        responses: {
            [StatusCodes.OK]: { description: RESP_200_VERIFY },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.TOO_MANY_REQUESTS]: { description: RESP_429 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })

    // 5. Forgot Password
    registry.registerPath({
        description: DESC_FORGOT,
        method: METHOD_POST,
        path: PATH_AUTH_FORGOT,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: ForgotPasswordSchema,
                    },
                },
            },
        },
        responses: {
            [StatusCodes.OK]: { description: RESP_200_FORGOT },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.TOO_MANY_REQUESTS]: { description: RESP_429 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })

    // 6. Reset Password
    registry.registerPath({
        description: DESC_RESET,
        method: METHOD_POST,
        path: PATH_AUTH_RESET,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: ResetPasswordSchema,
                    },
                },
            },
        },
        responses: {
            [StatusCodes.OK]: { description: RESP_200_RESET },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.TOO_MANY_REQUESTS]: { description: RESP_429 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_AUTH,
    })
}
