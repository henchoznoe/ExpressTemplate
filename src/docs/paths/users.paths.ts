/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/docs/paths/users.paths.ts
 * @title User OpenAPI Path Definitions
 * @description Registers all user-related API paths for OpenAPI documentation.
 * @last-modified 2025-11-17
 */

// --- Imports ---
import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { ROUTE_USERS, TAG_USERS } from '@routes/paths.js'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/auth.schema.js'

// --- Constants ---

// Paths
const PATH_USERS = ROUTE_USERS
const PATH_USERS_ID = `${ROUTE_USERS}/{id}`

// Methods
const METHOD_GET = 'get'
const METHOD_POST = 'post'
const METHOD_PATCH = 'patch'
const METHOD_DELETE = 'delete'

// Content Type
const MIME_TYPE_JSON = 'application/json'

// Descriptions
const DESC_GET_ALL = 'Get all users (Protected)'
const DESC_GET_BY_ID = 'Get a user by ID (Protected)'
const DESC_CREATE = 'Create a new user (Protected)'
const DESC_UPDATE = 'Update an existing user (Protected)'
const DESC_DELETE = 'Delete a user by ID (Protected)'

// Response Descriptions
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
            200: { description: RESP_200_LIST },
            401: { description: RESP_401 },
            404: { description: RESP_404 },
            500: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Register GET /users/{id}
    registry.registerPath({
        description: DESC_GET_BY_ID,
        method: METHOD_GET,
        path: PATH_USERS_ID,
        responses: {
            200: { description: RESP_200_DETAILS },
            401: { description: RESP_401 },
            404: { description: RESP_404 },
            500: { description: RESP_500 },
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
            201: { description: RESP_201_CREATED },
            400: { description: RESP_400 },
            401: { description: RESP_401 },
            409: { description: RESP_409_EMAIL },
            500: { description: RESP_500 },
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
            200: { description: RESP_200_UPDATED },
            400: { description: RESP_400 },
            401: { description: RESP_401 },
            404: { description: RESP_404 },
            409: { description: RESP_409_EMAIL },
            500: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Register DELETE /users/{id}
    registry.registerPath({
        description: DESC_DELETE,
        method: METHOD_DELETE,
        path: PATH_USERS_ID,
        responses: {
            200: { description: RESP_200_DELETED },
            401: { description: RESP_401 },
            404: { description: RESP_404 },
            500: { description: RESP_500 },
        },
        tags: TAG_USERS,
    })

    // Additional user-related paths can be registered here
}
