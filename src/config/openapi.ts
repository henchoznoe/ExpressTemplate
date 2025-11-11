/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/openapi.ts
 * @title OpenAPI Registry
 * @description This file registers all API paths and schemas for OpenAPI documentation.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/users.schema.js'

// --- Constants ---

// Paths
const PATH_USERS = '/users'
const PATH_USERS_ID = '/users/{id}'

// Methods
const METHOD_GET = 'get'
const METHOD_POST = 'post'
const METHOD_PUT = 'put'
const METHOD_DELETE = 'delete'

// Content Type
const MIME_TYPE_JSON = 'application/json'

// Status Codes
const STATUS_200 = 200
const STATUS_400 = 400
const STATUS_404 = 404
const STATUS_500 = 500

// Descriptions
const DESC_GET_ALL = 'Get all users'
const DESC_GET_BY_ID = 'Get a user by ID'
const DESC_CREATE = 'Create a new user'
const DESC_UPDATE = 'Update an existing user'
const DESC_DELETE = 'Delete a user by ID'

// Response Descriptions
const RESP_200_LIST = 'A list of users'
const RESP_200_DETAILS = 'User details'
const RESP_200_CREATED = 'User created successfully'
const RESP_200_UPDATED = 'User updated successfully'
const RESP_200_DELETED = 'User deleted successfully'
const RESP_400 = 'Validation error'
const RESP_404 = 'User not found'
const RESP_500 = 'Internal server error'

// --- Registry Setup ---

/**
 * The OpenAPI registry instance.
 * It holds all registered paths and component definitions (from Zod schemas).
 */
const registry = new OpenAPIRegistry()

// Register GET /users
registry.registerPath({
    description: DESC_GET_ALL,
    method: METHOD_GET,
    path: PATH_USERS,
    responses: {
        [STATUS_200]: { description: RESP_200_LIST },
        [STATUS_500]: { description: RESP_500 },
    },
})

// Register GET /users/{id}
registry.registerPath({
    description: DESC_GET_BY_ID,
    method: METHOD_GET,
    path: PATH_USERS_ID,
    responses: {
        [STATUS_200]: { description: RESP_200_DETAILS },
        [STATUS_404]: { description: RESP_404 },
        [STATUS_500]: { description: RESP_500 },
    },
})

// Register POST /users
registry.registerPath({
    description: DESC_CREATE,
    method: METHOD_POST,
    path: PATH_USERS,
    request: { body: { content: { [MIME_TYPE_JSON]: { schema: CreateUserSchema } } } },
    responses: {
        [STATUS_200]: { description: RESP_200_CREATED },
        [STATUS_400]: { description: RESP_400 },
        [STATUS_500]: { description: RESP_500 },
    },
})

// Register PUT /users
registry.registerPath({
    description: DESC_UPDATE,
    method: METHOD_PUT,
    path: PATH_USERS,
    request: { body: { content: { [MIME_TYPE_JSON]: { schema: UpdateUserSchema } } } },
    responses: {
        [STATUS_200]: { description: RESP_200_UPDATED },
        [STATUS_400]: { description: RESP_400 },
        [STATUS_404]: { description: RESP_404 },
        [STATUS_500]: { description: RESP_500 },
    },
})

// Register DELETE /users/{id}
registry.registerPath({
    description: DESC_DELETE,
    method: METHOD_DELETE,
    path: PATH_USERS_ID,
    responses: {
        [STATUS_200]: { description: RESP_200_DELETED },
        [STATUS_404]: { description: RESP_404 },
        [STATUS_500]: { description: RESP_500 },
    },
})

// --- Export ---
export default registry
