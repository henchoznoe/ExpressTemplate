import { applyRequestLogger } from '@middlewares/global/request-logger.js'
import { securityMiddlewares } from '@middlewares/global/security.js'
import type { Application } from 'express'

export const setupMiddlewares = (app: Application) => {
    // Security middlewares (CORS, Helmet, Rate Limiter, etc.)
    for (const mw of securityMiddlewares) app.use(mw)

    // Logger
    applyRequestLogger(app)
}
