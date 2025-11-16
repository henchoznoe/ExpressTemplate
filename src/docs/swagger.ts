/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/swagger.ts
 * @title Swagger/OpenAPI Setup
 * @description Configures and mounts the Swagger UI for API documentation.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import registry from '@docs/openapi-registry.js'
import type { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import pkg from '../../package.json' with { type: 'json' }

// --- Constants ---
const API_DOCS_ROUTE = '/api-docs'

/**
 * Generates the OpenAPI specification and mounts the Swagger UI middleware.
 * @param app - The main Express application instance.
 */
export const setupSwagger = (app: Application) => {
    const generator = new OpenApiGeneratorV3(registry.definitions)

    const openApiDoc = generator.generateDocument({
        info: {
            contact: {
                name: pkg.author,
                url: pkg.homepage,
            },
            description: pkg.description,
            title: pkg.name,
            version: pkg.version,
        },
        openapi: '3.0.0',
    })

    app.use(API_DOCS_ROUTE, swaggerUi.serve, swaggerUi.setup(openApiDoc))
}
