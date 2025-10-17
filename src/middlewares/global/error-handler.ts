import { errorLoggerMiddleware } from '@config/logger.js'
import { sendError } from '@utils/http-responses.js'
import type { Application, NextFunction, Request, Response } from 'express'

export const applyErrorHandlers = (app: Application) => {
    // 404
    app.use((req: Request, res: Response) => {
        sendError(res, 404, `Route ${req.path} not found`)
    })

    // 500 & custom errors
    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
        errorLoggerMiddleware(err, req, res, next)
    })
}
