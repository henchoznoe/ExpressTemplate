/**
 * @file src/config/logger.ts
 * @title Logger Configuration
 * @description Configures and exports the Winston logger instance.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { createLogger, format, transports } from 'winston'

// --- Format Destructuring ---
const { combine, timestamp, printf, colorize, errors, splat } = format

// --- Constants ---
const LOG_LEVEL_DEFAULT = 'info'
const LOG_LEVEL_DEV = 'debug'
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const CONSOLE_LOG_LEVEL =
    process.env.NODE_ENV === 'development' ? LOG_LEVEL_DEV : LOG_LEVEL_DEFAULT

/**
 * Custom format for console logs, including colorization and stack traces.
 */
const winstonConsoleFormat = combine(
    colorize(),
    timestamp({ format: TIMESTAMP_FORMAT }),
    errors({ stack: true }),
    splat(),
    printf(({ level, message, timestamp, stack }) =>
        stack
            ? `${timestamp} [${level}] ${message}\n${stack}`
            : `${timestamp} [${level}] ${message}`,
    ),
)

/**
 * Transport for logging to the console.
 */
const winstonConsoleTransport = new transports.Console({
    format: winstonConsoleFormat,
})

/**
 * The main Winston logger instance.
 * Exported for use throughout the application for manual logging.
 */
export const log = createLogger({
    exitOnError: false,
    format: combine(
        errors({ stack: true }),
        splat(),
        timestamp({ format: TIMESTAMP_FORMAT }),
    ),
    level: CONSOLE_LOG_LEVEL,
    transports: [winstonConsoleTransport],
})
