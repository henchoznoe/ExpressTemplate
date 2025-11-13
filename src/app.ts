/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/app.ts
 * @title Express Application Factory
 * @description This file creates and configures the main Express application instance.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import { setupSwagger } from '@config/swagger.js'
import { setupErrorHandler } from '@middlewares/global/error-handler.js'
import { setupMiddlewares } from '@middlewares/index.js'
import { setupRoutes } from '@routes/index.js'
import express from 'express'

// Create the main Express app instance
const app = express()

// --- Trust Proxy Setting ---
// Tell Express that it is behind a proxy (e.g., Docker, Nginx, Traefik).
// Setting 'trust proxy' to 1 means it will trust the first hop (X-Forwarded-For).
app.set('trust proxy', 1)

// 1. Core Middlewares
// Apply security, logging, and body parsing middlewares first.
setupMiddlewares(app)

// 2. API Documentation
// Mount the Swagger UI.
setupSwagger(app)

// 3. Application Routes
// Mount all API routes.
setupRoutes(app)

// 4. Error Handling
// Mount the global error handlers (e.g., 404, 500).
setupErrorHandler(app)

export default app
