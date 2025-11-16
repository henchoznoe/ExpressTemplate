/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/docs/openapi-registry.ts
 * @title OpenAPI Registry
 * @description This file registers all API paths and schemas for OpenAPI documentation.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { registerAuthPaths } from '@docs/paths/auth.paths.js'
import { registerUserPaths } from '@docs/paths/users.paths.js'

/**
 * The OpenAPI registry instance.
 * It holds all registered paths and component definitions (from Zod schemas).
 */
const registry = new OpenAPIRegistry()

// Register all path definitions
registerAuthPaths(registry)
registerUserPaths(registry)
// ... register other paths as needed

export default registry
