/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/index.ts
 * @title Main application entry point
 * @description This file imports the application and starts the HTTP server.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import { config } from '@config/env.js'
import { log } from '@config/logger.js'
import { app } from '@/app.js'

// --- Constants ---

// Standard exit code for unrecoverable failure.
const EXIT_CODE_FAILURE = 1
// Log messages for server startup.
const APP_URL_LOG = `🚀 Server ready at: \t\thttp://localhost:${config.port}`
const DOC_URL_LOG = `📗 API docs ready at: \thttp://localhost:${config.port}/api-docs`
const APP_STARTED_LOG = `🔄 Environment : \t\t${config.nodeEnv.toUpperCase()}`
const APP_ERROR_PREFIX = '☠️ Server failed to start:'

/**
 * Starts the Express server and binds the success and error handlers.
 */
const main = () => {
    app.listen(config.port, onServerStarted).on('error', onServerError)
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
