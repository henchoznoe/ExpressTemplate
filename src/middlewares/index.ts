import type { Application } from 'express'
import { applyErrorHandlers } from './global/error-handler.js'
import { applyRequestLogger } from './global/request-logger.js'
import { securityMiddlewares } from './global/security.js'

export const setupMiddlewares = (app: Application) => {
    // Security middlewares (CORS, Helmet, Rate Limiter, etc.)
    for (const mw of securityMiddlewares) app.use(mw)

    // Logger
    applyRequestLogger(app)

    // Error handlers
    applyErrorHandlers(app)
}
