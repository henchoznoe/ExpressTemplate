/**
 * @file src/docs/paths/users.paths.ts
 * @title User OpenAPI Path Definitions
 * @description Registers all user-related API paths for OpenAPI documentation.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { ROUTE_USERS, TAG_USERS } from '@routes/paths.js'
import { StatusCodes } from 'http-status-codes'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/auth.schema.js'

// --- Constants ---
const PATH_USERS = ROUTE_USERS
const PATH_USERS_ID = `${ROUTE_USERS}/{id}`
const METHOD_GET = 'get'
const METHOD_POST = 'post'
const METHOD_PATCH = 'patch'
const METHOD_DELETE = 'delete'
const MIME_TYPE_JSON = 'application/json'
const DESC_GET_ALL = 'Get all users (Protected)'
const DESC_GET_BY_ID = 'Get a user by ID (Protected)'
const DESC_CREATE = 'Create a new user (Protected)'
const DESC_UPDATE = 'Update an existing user (Protected)'
const DESC_DELETE = 'Delete a user by ID (Protected)'
const RESP_200_LIST = 'A list of users'
const RESP_200_DETAILS = 'User details'
const RESP_201_CREATED = 'User created successfully'
const RESP_200_UPDATED = 'User updated successfully'
const RESP_200_DELETED = 'User deleted successfully'
const RESP_400 = 'Validation error'
const RESP_401 = 'Unauthorized (Token missing or invalid)'
const RESP_404 = 'User not found'
const RESP_409_EMAIL = 'Email already in use'
const RESP_500 = 'Internal server error'

/**
 * Registers all user-related paths with the OpenAPI registry.
 * @param registry - The main OpenAPI registry instance.
 */
export const registerUserPaths = (registry: OpenAPIRegistry) => {
    // Register GET /users
    registry.registerPath({
        description: DESC_GET_ALL,
        method: METHOD_GET,
        path: PATH_USERS,
        responses: {
            [StatusCodes.OK]: { description: RESP_200_LIST },
            [StatusCodes.UNAUTHORIZED]: { description: RESP_401 },
            [StatusCodes.NOT_FOUND]: { description: RESP_404 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Register GET /users/{id}
    registry.registerPath({
        description: DESC_GET_BY_ID,
        method: METHOD_GET,
        path: PATH_USERS_ID,
        responses: {
            [StatusCodes.OK]: { description: RESP_200_DETAILS },
            [StatusCodes.UNAUTHORIZED]: { description: RESP_401 },
            [StatusCodes.NOT_FOUND]: { description: RESP_404 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Register POST /users
    registry.registerPath({
        description: DESC_CREATE,
        method: METHOD_POST,
        path: PATH_USERS,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: CreateUserSchema,
                    },
                },
            },
        },
        responses: {
            [StatusCodes.CREATED]: { description: RESP_201_CREATED },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.UNAUTHORIZED]: { description: RESP_401 },
            [StatusCodes.CONFLICT]: { description: RESP_409_EMAIL },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Register PATCH /users/{id}
    registry.registerPath({
        description: DESC_UPDATE,
        method: METHOD_PATCH,
        path: PATH_USERS_ID,
        request: {
            body: {
                content: {
                    [MIME_TYPE_JSON]: {
                        schema: UpdateUserSchema,
                    },
                },
            },
        },
        responses: {
            [StatusCodes.OK]: { description: RESP_200_UPDATED },
            [StatusCodes.BAD_REQUEST]: { description: RESP_400 },
            [StatusCodes.UNAUTHORIZED]: { description: RESP_401 },
            [StatusCodes.NOT_FOUND]: { description: RESP_404 },
            [StatusCodes.CONFLICT]: { description: RESP_409_EMAIL },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Register DELETE /users/{id}
    registry.registerPath({
        description: DESC_DELETE,
        method: METHOD_DELETE,
        path: PATH_USERS_ID,
        responses: {
            [StatusCodes.OK]: { description: RESP_200_DELETED },
            [StatusCodes.UNAUTHORIZED]: { description: RESP_401 },
            [StatusCodes.NOT_FOUND]: { description: RESP_404 },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Additional user-related paths can be registered here
}
