/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/logger.ts
 * @title Logger Configuration
 * @description Configures the Winston logger, Morgan request logger, and error logging middleware.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import type { Application, Request, Response } from 'express'
import morgan from 'morgan'
import statuses from 'statuses'
import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import config from '@config/env.js'

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
const CONSOLE_LOG_LEVEL = config.nodeEnv === 'development' ? LOG_LEVEL_DEV : LOG_LEVEL_DEFAULT

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

// Add these stream objects right after the defineMorganTokens function

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
 * Sets up the Morgan request logger middleware on the Express app.
 * @param app - The main Express application instance.
 */
export const setupLogger = (app: Application) => {
    defineMorganTokens()

    // 1. Log all successful responses (2xx, 3xx) to info
    app.use(
        morgan(MORGAN_FORMAT, {
            // Log only if status code is less than 400
            skip: (_: Request, res: Response) => res.statusCode >= HTTP_CLIENT_ERROR,
            stream: infoStream,
        }),
    )

    // 2. Log client errors (4xx) to warn
    app.use(
        morgan(MORGAN_FORMAT, {
            // Log only if status code is 4xx
            skip: (_: Request, res: Response) =>
                res.statusCode < HTTP_CLIENT_ERROR || res.statusCode >= HTTP_SERVER_ERROR,
            stream: warnStream,
        }),
    )

    // 3. Log server errors (5xx) to error
    app.use(
        morgan(MORGAN_FORMAT, {
            // Log only if status code is 500 or higher
            skip: (_: Request, res: Response) => res.statusCode < HTTP_SERVER_ERROR,
            stream: errorStream,
        }),
    )
}
