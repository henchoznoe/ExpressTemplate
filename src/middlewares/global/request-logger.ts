/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/middlewares/global/request-logger.ts
 * @title Request Logger Middleware
 * @description Applies the Morgan request logger to the Express app, piping output to Winston.
 * @last-modified 2025-11-17
 */

import { log } from '@config/logger.js'
import type { Application, Request, Response } from 'express'
import { getReasonPhrase } from 'http-status-codes'
import morgan from 'morgan'

// --- Constants ---
const MORGAN_TOKEN_STATUS = 'statusName'
const MORGAN_TOKEN_IP = 'clientIp'
const MORGAN_FORMAT =
    ':method :url [:statusName] [:clientIp] - :response-time ms'
const MSG_UNKNOWN_STATUS = 'Unknown Status'
const HTTP_CLIENT_ERROR = 400
const HTTP_SERVER_ERROR = 500

/**
 * Defines custom tokens for Morgan to use in log formats.
 */
const defineMorganTokens = () => {
    // Token for status code + status message (e.g., "200 - OK")
    morgan.token(MORGAN_TOKEN_STATUS, (_: Request, res: Response) => {
        const code = res.statusCode
        return `${code} - ${getReasonPhrase(code) || MSG_UNKNOWN_STATUS}`
    })

    // Token for client IP address
    morgan.token(MORGAN_TOKEN_IP, (req: Request) => req.ip || 'unknown')
}

/**
 * A simple stream interface for piping Morgan output to Winston.
 */
interface WinstonStream {
    write: (message: string) => void
}

/**
 * Stream to pipe Morgan's output to Winston's info level.
 */
const infoStream: WinstonStream = {
    write: (message: string) => log.info(message.trim()),
}

/**
 * Stream to pipe Morgan's output to Winston's warn level.
 */
const warnStream: WinstonStream = {
    write: (message: string) => log.warn(message.trim()),
}

/**
 * Stream to pipe Morgan's output to Winston's error level.
 */
const errorStream: WinstonStream = {
    write: (message: string) => log.error(message.trim()),
}

/**
 * Applies the configured request logger (Morgan) to the Express app.
 * It sets up custom tokens and defines separate streams for success, client errors, and server errors.
 *
 * @param app - The main Express application instance.
 */
export const applyRequestLogger = (app: Application) => {
    defineMorganTokens()

    // 1. Log all successful responses (2xx, 3xx) to info
    app.use(
        morgan(MORGAN_FORMAT, {
            // Log only if status code is less than 400
            skip: (_: Request, res: Response) =>
                res.statusCode >= HTTP_CLIENT_ERROR,
            stream: infoStream,
        }),
    )

    // 2. Log client errors (4xx) to warn
    app.use(
        morgan(MORGAN_FORMAT, {
            // Log only if status code is 4xx
            skip: (_: Request, res: Response) =>
                res.statusCode < HTTP_CLIENT_ERROR ||
                res.statusCode >= HTTP_SERVER_ERROR,
            stream: warnStream,
        }),
    )

    // 3. Log server errors (5xx) to error
    app.use(
        morgan(MORGAN_FORMAT, {
            // Log only if status code is 500 or higher
            skip: (_: Request, res: Response) =>
                res.statusCode < HTTP_SERVER_ERROR,
            stream: errorStream,
        }),
    )
}
