import type { ResponseType } from '@my-types/http-responses.js'
import type { Response } from 'express'

export const sendSuccess = (res: Response, status: number, message: string, data: object = {}) => {
    res.status(status).json({ data, message, success: true } as ResponseType)
}

export const sendError = (res: Response, status: number, message: string, data: object = {}) => {
    res.status(status).json({ data, message, success: false } as ResponseType)
}
