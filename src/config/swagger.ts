/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/swagger.ts
 * @title Swagger/OpenAPI Setup
 * @description Configures and mounts the Swagger UI for API documentation.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import registry from '@config/openapi.js'
import type { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import pkg from '../../package.json' with { type: 'json' }

// --- Constants ---
const API_DOCS_ROUTE = '/api-docs'
const API_TITLE = 'Express TypeScript API'
const API_DESCRIPTION = 'Basic Express Template'
const API_OPENAPI_VERSION = '3.0.0'

// --- Swagger Setup ---

/**
 * Generates the OpenAPI specification and mounts the Swagger UI middleware.
 * @param app - The main Express application instance.
 */
export const setupSwagger = (app: Application) => {
    // 1. Create the generator instance using our Zod registry
    const generator = new OpenApiGeneratorV3(registry.definitions)

    // 2. Generate the OpenAPI document specification
    const openApiDoc = generator.generateDocument({
        info: {
            description: API_DESCRIPTION,
            title: API_TITLE,
            version: pkg.version,
        },
        openapi: API_OPENAPI_VERSION,
    })

    // 3. Mount the Swagger UI middleware on the specified route
    app.use(API_DOCS_ROUTE, swaggerUi.serve, swaggerUi.setup(openApiDoc))
}
