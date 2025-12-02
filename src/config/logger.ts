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
import 'winston-daily-rotate-file'

// --- Format Destructuring ---
const { combine, timestamp, printf, colorize, errors, splat } = format

// --- Constants ---
const LOG_LEVEL_DEFAULT = 'info'
const LOG_LEVEL_DEV = 'debug'
const LOG_LEVEL_ERROR = 'error'
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_PATTERN = 'YYYY-MM-DD'
const CONSOLE_LOG_LEVEL =
    process.env.NODE_ENV === 'development' ? LOG_LEVEL_DEV : LOG_LEVEL_DEFAULT
const FILE_LOG_LEVEL = 'info'
const FILE_MAX_SIZE = '20m'
const FILE_MAX_FILES_APP = '14d'
const FILE_MAX_FILES_ERROR = '30d'
const FILE_PATH_APP = 'logs/%DATE%-app.log'
const FILE_PATH_ERROR = 'logs/%DATE%-error.log'

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
 * Custom format for file logs (no color, simple timestamp).
 */
const winstonFileFormat = combine(
    timestamp({ format: TIMESTAMP_FORMAT }),
    printf(
        ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`,
    ),
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
        stack
            ? `${timestamp} [${level}] ${message}\n${stack}`
            : `${timestamp} [${level}] ${message}`,
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
    exitOnError: false,
    format: combine(
        errors({ stack: true }),
        splat(),
        timestamp({ format: TIMESTAMP_FORMAT }),
    ),
    level: CONSOLE_LOG_LEVEL,
    transports: [
        winstonConsoleTransport,
        winstonAppFileTransport,
        winstonErrorFileTransport,
    ],
})
