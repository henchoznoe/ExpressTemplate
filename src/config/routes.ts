import { errorLoggerMiddleware } from '@config/logger.js'
import usersRouter from '@routes/users.route.js'
import { sendError, sendSuccess } from '@utils/http-responses.js'
import type { Application, Request, Response } from 'express'

export const setupRoutes = (app: Application): void => {
    // Health check route
    app.get('/', (_: Request, res: Response) => {
        sendSuccess(res, 200, 'API is running!', {
            timestamp: new Date().toLocaleString(),
            uptime: `${process.uptime().toFixed(0)} seconds`,
        })
    })

    // API routes
    app.use('/users', usersRouter)
    // ...

    // Errors handling middlewares
    app.use((req: Request, res: Response): void => {
        sendError(res, 404, `Route ${req.path} not found`)
    })
    app.use(errorLoggerMiddleware)
}
