import { AppError } from '@my-types/errors/AppError.js'
import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'

export const validateFields = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body)
        next()
    } catch (err) {
        if (err instanceof ZodError) {
            const messages = err.issues.map(i => i.message).join(', ')
            return next(new AppError(messages, 400))
        }
        if (err instanceof Error) return next(new AppError(err.message, 400))
        next(new AppError('Unknown validation error', 400))
    }
}
