/**
 * @file src/index.ts
 * @title Main application entry point
 * @description This file imports the application and starts the HTTP server.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { config } from '@config/env.js'
import { log } from '@config/logger.js'
import { prisma } from '@config/prisma.js'
import { app } from '@/app.js'
import 'dotenv/config'

// --- Constants ---
const EXIT_CODE_FAILURE = 1
const APP_URL_LOG = `🚀 Server ready at: \t\thttp://localhost:${config.port}`
const DOC_URL_LOG = `📗 API docs ready at: \thttp://localhost:${config.port}/api-docs`
const APP_STARTED_LOG = `🔄 Environment : \t\t${config.nodeEnv.toUpperCase()}`
const APP_ERROR_PREFIX = '☠️ Server failed to start:'

/**
 * Starts the Express server and binds the success and error handlers.
 */
const main = () => {
    const server = app
        .listen(config.port, onServerStarted)
        .on('error', onServerError)

    const gracefulShutdown = async (signal: string) => {
        log.info(`Received ${signal}. Closing server...`)
        server.close(async () => {
            log.info('HTTP server closed.')
            try {
                await prisma.$disconnect()
                log.info('Database connection closed.')
                process.exit(0)
            } catch (err) {
                log.error('Error during database disconnection', err)
                process.exit(1)
            }
        })
        setTimeout(() => {
            log.error(
                'Could not close connections in time, forcefully shutting down',
            )
            process.exit(1)
        }, 10000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}

/**
 * Handles the 'listening' event when the server starts successfully.
 * Logs the application status and accessible URLs.
 */
const onServerStarted = () => {
    log.info('===========================================================')
    log.info(APP_URL_LOG)
    log.info(DOC_URL_LOG)
    log.info(APP_STARTED_LOG)
    log.info('===========================================================')
}

/**
 * Handles critical startup errors (e.g., port already in use).
 * Logs the error and exits the process with a failure code.
 * @param error - The error object caught from the 'error' event.
 */
const onServerError = (error: Error) => {
    log.error(`${APP_ERROR_PREFIX} ${error.message}`)
    process.exit(EXIT_CODE_FAILURE)
}

// Run the application
main()
