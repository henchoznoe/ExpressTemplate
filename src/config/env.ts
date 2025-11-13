/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/env.ts
 * @title Environment Variable Configuration
 * @description Validates environment variables using Zod and exports a type-safe config object.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import { log } from '@config/logger.js'
import { z } from 'zod'

// --- Constants ---
const EXIT_CODE_FAILURE = 1
const ERROR_MSG_INVALID_ENV = 'Invalid environment variables :'
const ERROR_MSG_PORT_INVALID = 'PORT must be a positive integer'
const ERROR_MSG_SALT_INVALID = 'BCRYPT_SALT_ROUNDS must be a positive integer'
const ERROR_PATH_SEPARATOR = '.'
const ERROR_PATH_ROOT = '(root)'

/**
 * Defines the schema for all required environment variables.
 * This schema is used to validate `process.env` at application startup.
 */
const envSchema = z.object({
    BCRYPT_SALT_ROUNDS: z
        .string()
        .nonempty()
        .transform(val => parseInt(val, 10))
        .refine(val => !Number.isNaN(val) && val > 0, {
            message: ERROR_MSG_SALT_INVALID,
        }),
    CORS_ALLOWED_HEADERS: z.string().nonempty(),
    CORS_METHODS: z.string().nonempty(),
    CORS_ORIGIN: z.string().nonempty(),
    JWT_EXPIRES_IN: z.string().nonempty(),
    JWT_SECRET: z.string().nonempty(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z
        .string()
        .nonempty()
        .transform(val => parseInt(val, 10))
        .refine(val => !Number.isNaN(val) && val > 0, {
            message: ERROR_MSG_PORT_INVALID,
        }),
    SUPABASE_ANON_KEY: z.string().nonempty(),
    SUPABASE_URL: z.url().nonempty(),
})

/**
 * Logs detailed validation errors.
 * This is called on startup if the environment variables are invalid.
 * @param error - The ZodSafeParseError containing all validation issues.
 */
const logOnInvalidEnv = (error: z.ZodSafeParseError<unknown>['error']) => {
    log.error(ERROR_MSG_INVALID_ENV)
    for (const issue of error.issues) {
        const path = issue.path.join(ERROR_PATH_SEPARATOR) || ERROR_PATH_ROOT
        const message = issue.message
        log.error(`- ${path} : ${message}`)
    }
}

// Attempt to parse and validate the environment variables
const parsedEnv = envSchema.safeParse(process.env)

// If validation fails, log details and exit
if (!parsedEnv.success) {
    logOnInvalidEnv(parsedEnv.error)
    process.exit(EXIT_CODE_FAILURE)
}

/**
 * The type-safe, validated configuration object.
 * This is the "single source of truth" for all environment-based settings.
 */
const config = {
    bcryptSaltRounds: parsedEnv.data.BCRYPT_SALT_ROUNDS,
    corsAllowedHeaders: parsedEnv.data.CORS_ALLOWED_HEADERS,
    corsMethods: parsedEnv.data.CORS_METHODS,
    corsOrigin: parsedEnv.data.CORS_ORIGIN,
    jwtExpiresIn: parsedEnv.data.JWT_EXPIRES_IN,
    jwtSecret: parsedEnv.data.JWT_SECRET,
    nodeEnv: parsedEnv.data.NODE_ENV,
    port: parsedEnv.data.PORT,
    supabaseAnonKey: parsedEnv.data.SUPABASE_ANON_KEY,
    supabaseUrl: parsedEnv.data.SUPABASE_URL,
}

export default config
