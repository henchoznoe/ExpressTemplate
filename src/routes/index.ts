import config from '@config/env.js'
import { errorLoggerMiddleware } from '@config/logger.js'
import usersRouter from '@routes/users.route.js'
import { sendSuccess } from '@utils/http-responses.js'
import type { Application, Request, Response } from 'express'
import pkg from '../../package.json' with { type: 'json' }

export const setupRoutes = (app: Application): void => {
    // Health check route
    app.get('/', (_: Request, res: Response) => {
        const healthCheckData = {
            environment: config.nodeEnv,
            memory: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
            node: process.version,
            timestamp: new Date().toLocaleString(),
            uptime: `${process.uptime().toFixed(0)} seconds`,
            version: pkg.version,
        }
        sendSuccess(res, 200, 'Health check successful', healthCheckData)
    })

    // API routes
    app.use('/users', usersRouter)
    // ...

    app.use(errorLoggerMiddleware)
}
