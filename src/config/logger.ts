/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/logger.ts
 * @title Logger Configuration
 * @description Configures the Winston logger, Morgan request logger, and error logging middleware.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import type { Application, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import statuses from 'statuses'
import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import type { AppError } from '@typings/errors/AppError.js'

// --- Format Destructuring ---
const { combine, timestamp, printf, colorize, errors, splat } = format

// --- Constants ---

// Log levels
const LOG_LEVEL_DEFAULT = 'info'
const LOG_LEVEL_DEV = 'debug'
const LOG_LEVEL_ERROR = 'error'

// Date/Time formats
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_PATTERN = 'YYYY-MM-DD'

// Console logging
const CONSOLE_LOG_LEVEL = process.env.NODE_ENV === 'development' ? LOG_LEVEL_DEV : LOG_LEVEL_DEFAULT

// File transport settings
const FILE_LOG_LEVEL = 'info'
const FILE_MAX_SIZE = '20m'
const FILE_MAX_FILES_APP = '14d'
const FILE_MAX_FILES_ERROR = '30d'
const FILE_PATH_APP = 'logs/%DATE%-app.log'
const FILE_PATH_ERROR = 'logs/%DATE%-error.log'

// Morgan request logging
const MORGAN_TOKEN_STATUS = 'statusName'
const MORGAN_TOKEN_IP = 'clientIp'
const MORGAN_FORMAT = ':method :url [:statusName] [:clientIp]'
const MSG_UNKNOWN_STATUS = 'Unknown Status'

// HTTP Status Codes for logging logic
const HTTP_CLIENT_ERROR = 400
const HTTP_SERVER_ERROR = 500

// Error logging messages
const MSG_UNHANDLED_ERROR = 'Unhandled error:'
const MSG_UNHANDLED_NON_ERROR = 'Unhandled non-Error thrown'

/**
 * Custom format for console logs, including colorization and stack traces.
 */
const winstonConsoleFormat = combine(
    colorize(),
    timestamp({ format: TIMESTAMP_FORMAT }),
    errors({ stack: true }),
    splat(),
    printf(({ level, message, timestamp, stack }) =>
        stack ? `${timestamp} [${level}] ${message}\n${stack}` : `${timestamp} [${level}] ${message}`,
    ),
)

/**
 * Transport for logging to the console.
 */
const winstonConsoleTransport = new transports.Console({
    format: winstonConsoleFormat,
})

/**
 * Custom format for file logs (no color, simple timestamp).
 */
const winstonFileFormat = combine(
    timestamp({ format: TIMESTAMP_FORMAT }),
    printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`),
)

/**
 * Transport for general application logs (e.g., info, warn), rotated daily.
 */
const winstonAppFileTransport = new transports.DailyRotateFile({
    datePattern: DATE_PATTERN,
    filename: FILE_PATH_APP,
    format: winstonFileFormat,
    level: FILE_LOG_LEVEL,
    maxFiles: FILE_MAX_FILES_APP,
    maxSize: FILE_MAX_SIZE,
    zippedArchive: true,
})

/**
 * Custom format for error file logs, including stack traces.
 */
const winstonErrorFileFormat = combine(
    timestamp({ format: TIMESTAMP_FORMAT }),
    errors({ stack: true }), // Include stack traces in error logs
    printf(({ timestamp, level, message, stack }) =>
        stack ? `${timestamp} [${level}] ${message}\n${stack}` : `${timestamp} [${level}] ${message}`,
    ),
)

/**
 * Transport for error logs only, rotated daily.
 */
const winstonErrorFileTransport = new transports.DailyRotateFile({
    datePattern: DATE_PATTERN,
    filename: FILE_PATH_ERROR,
    format: winstonErrorFileFormat,
    level: LOG_LEVEL_ERROR,
    maxFiles: FILE_MAX_FILES_ERROR,
    maxSize: FILE_MAX_SIZE,
    zippedArchive: true,
})

/**
 * The main Winston logger instance.
 * Exported for use throughout the application for manual logging.
 */
export const log = createLogger({
    exitOnError: false, // Do not exit on handled exceptions
    format: combine(errors({ stack: true }), splat(), timestamp({ format: TIMESTAMP_FORMAT })),
    level: CONSOLE_LOG_LEVEL,
    transports: [winstonConsoleTransport, winstonAppFileTransport, winstonErrorFileTransport],
})

/**
 * Defines custom tokens for Morgan to use in log formats.
 */
const defineMorganTokens = () => {
    // Token for status code + status message (e.g., "200 - OK")
    morgan.token(MORGAN_TOKEN_STATUS, (_: Request, res: Response) => {
        const code = res.statusCode
        const name = statuses.message[code] || MSG_UNKNOWN_STATUS
        return `${code} - ${name}`
    })

    // Token for client IP address
    morgan.token(MORGAN_TOKEN_IP, (req: Request) => req.ip)
}

/**
 * A write stream for Morgan that pipes messages to the Winston logger.
 * It intelligently routes messages to log.error, log.warn, or log.info
 * based on the HTTP status code.
 * @param message - The log message from Morgan.
 */
const logMorganStream = (message: string) => {
    try {
        const statusCode = parseInt(message.split('[')[1].split(' - ')[0], 10)

        if (statusCode >= HTTP_SERVER_ERROR) {
            log.error(message.trim())
        } else if (statusCode >= HTTP_CLIENT_ERROR) {
            log.warn(message.trim())
        } else {
            log.info(message.trim())
        }
    } catch (_) {
        // Fallback in case parsing fails
        log.info(message.trim())
    }
}

/**
 * Sets up the Morgan request logger middleware on the Express app.
 * @param app - The main Express application instance.
 */
export const setupLogger = (app: Application) => {
    defineMorganTokens()

    app.use(
        morgan(MORGAN_FORMAT, {
            stream: {
                // Pipe Morgan's output through our custom Winston logger
                write: logMorganStream,
            },
        }),
    )
}

/**
 * An Express error handling middleware that logs unhandled errors.
 * This middleware only logs. It passes the error to the next
 * error handler (i.e., `globalErrorHandler`) to send the response.
 * @param err - The error object.
 * @param _req - The Express Request object (unused).
 * @param _res - The Express Response object (unused).
 * @param next - The Express NextFunction.
 */
export const errorLoggerMiddleware = (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        // We check for AppError here to potentially log differently, but we must log all errors
        const appErr = err as AppError
        if (appErr.stack) {
            log.error(`${MSG_UNHANDLED_ERROR} ${appErr.message}\n${appErr.stack}`)
        } else {
            log.error(`${MSG_UNHANDLED_ERROR} ${appErr.message}`)
        }
    } else {
        log.error(MSG_UNHANDLED_NON_ERROR, err)
    }

    // Pass the error to the next error handler (globalErrorHandler)
    return next(err)
}
