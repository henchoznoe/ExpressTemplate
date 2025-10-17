import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/users.schema.js'

const registry = new OpenAPIRegistry()

registry.registerPath({
    description: 'Get all users',
    method: 'get',
    path: '/users',
    responses: {
        200: { description: 'A list of users' },
        500: { description: 'Internal server error' },
    },
})

registry.registerPath({
    description: 'Get a user by ID',
    method: 'get',
    path: '/users/{id}',
    responses: {
        200: { description: 'User details' },
        404: { description: 'User not found' },
        500: { description: 'Internal server error' },
    },
})

registry.registerPath({
    description: 'Create a new user',
    method: 'post',
    path: '/users',
    request: { body: { content: { 'application/json': { schema: CreateUserSchema } } } },
    responses: {
        200: { description: 'User created successfully' },
        400: { description: 'Validation error' },
        500: { description: 'Internal server error' },
    },
})

registry.registerPath({
    description: 'Update an existing user',
    method: 'put',
    path: '/users',
    request: { body: { content: { 'application/json': { schema: UpdateUserSchema } } } },
    responses: {
        200: { description: 'User updated successfully' },
        400: { description: 'Validation error' },
        404: { description: 'User not found' },
        500: { description: 'Internal server error' },
    },
})

registry.registerPath({
    description: 'Delete a user by ID',
    method: 'delete',
    path: '/users/{id}',
    responses: {
        200: { description: 'User deleted successfully' },
        404: { description: 'User not found' },
        500: { description: 'Internal server error' },
    },
})

export default registry
