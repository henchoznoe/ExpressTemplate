/**
 * @file src/docs/paths/health.paths.ts
 * @title Health Check API Documentation Path
 * @description Registers health API path for OpenAPI documentation.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { ROUTE_HEALTH, TAG_HEALTH } from '@routes/paths.js'
import { StatusCodes } from 'http-status-codes'

// --- Constants ---
const PATH_HEALTH = ROUTE_HEALTH
const METHOD_GET = 'get'
const DESC_HEALTH = 'Health check endpoint to verify service status'
const RESP_200_HEALTH = 'Service is healthy'
const RESP_500 = 'Internal server error'

export const registerHealthPath = (registry: OpenAPIRegistry) => {
    // Health check GET /
    registry.registerPath({
        description: DESC_HEALTH,
        method: METHOD_GET,
        path: PATH_HEALTH,
        responses: {
            [StatusCodes.OK]: { description: RESP_200_HEALTH },
            [StatusCodes.INTERNAL_SERVER_ERROR]: { description: RESP_500 },
        },
        tags: TAG_HEALTH,
    })
}
