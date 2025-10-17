import { log } from '@config/logger.js'
import { AppError } from '@my-types/errors/AppError.js'
import { sendError } from '@utils/http-responses.js'
import type { Application, NextFunction, Request, Response } from 'express'

export const globalErrorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        log.warn(`Operational error: ${err.message}`)
        sendError(res, err.status, err.message)
    } else if (err instanceof Error) {
        log.error(`Unexpected error: ${err.message}\n${err.stack}`)
        sendError(res, 500, 'Internal Server Error')
    } else {
        log.error('Unknown error type')
        sendError(res, 500, 'Internal Server Error')
    }
}

export const setupErrorHandler = (app: Application) => {
    // 404
    app.use((req: Request, res: Response) => {
        sendError(res, 404, `Route ${req.path} not found`)
    })

    // 500 + other errors
    app.use(globalErrorHandler)
}
