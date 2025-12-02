/**
 * @file src/docs/openapi-registry.ts
 * @title OpenAPI Registry
 * @description This file registers all API paths and schemas for OpenAPI documentation.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { registerAuthPaths } from '@docs/paths/auth.paths.js'
import { registerHealthPath } from '@docs/paths/health.paths.js'
import { registerUserPaths } from '@docs/paths/users.paths.js'

/**
 * The OpenAPI registry instance.
 * It holds all registered paths and component definitions (from Zod schemas).
 */
export const registry = new OpenAPIRegistry()

// Register all path definitions
registerAuthPaths(registry)
registerUserPaths(registry)
registerHealthPath(registry)
// ... register other paths as needed
