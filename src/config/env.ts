/**
 * @file src/config/env.ts
 * @title Environment Variable Configuration
 * @description Validates environment variables using Zod and exports a type-safe config object.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { log } from '@config/logger.js'
import { z } from 'zod'

// --- Constants ---
const EXIT_CODE_FAILURE = 1
const ERROR_MSG_INVALID_ENV = 'Invalid environment variables :'
const ERROR_MSG_NOT_PROVIDED = 'must be provided'
const ERROR_MSG_IS_EMPTY = "can't be empty"
const ERROR_MSG_POSITIVE_INTEGER = 'must be a positive integer'
const ERROR_MSG_URL = 'must be a valid URL'
const ERROR_MSG_APP_MODE = 'must be development, production or test'
const ERROR_MSG_ORIGIN = 'cannot be "*" in production'
const ERROR_PATH_SEPARATOR = '.'
const ERROR_PATH_ROOT = '(root)'

/**
 * Defines the schema for all required environment variables.
 * This schema is used to validate `process.env` at application startup.
 */
const EnvSchema = z.object({
    BCRYPT_SALT_ROUNDS: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY })
        .transform(val => parseInt(val, 10))
        .refine(val => !Number.isNaN(val) && val > 0, {
            error: ERROR_MSG_POSITIVE_INTEGER,
        }),
    CORS_ALLOWED_HEADERS: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    CORS_METHODS: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    CORS_ORIGIN: z
        .union([z.url({ message: ERROR_MSG_URL }), z.literal('*')])
        .refine(val => process.env.NODE_ENV === 'development' || val !== '*', {
            message: ERROR_MSG_ORIGIN,
        }),
    DATABASE_URL: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    DIRECT_URL: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    EMAIL_FROM: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    FRONTEND_URL: z.url({ message: ERROR_MSG_URL }),
    JWT_ACCESS_EXPIRES_IN: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    JWT_ACCESS_SECRET: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    JWT_REFRESH_EXPIRES_IN: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    JWT_REFRESH_SECRET: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
    NODE_ENV: z
        .enum(['development', 'production', 'test'], {
            error: ERROR_MSG_APP_MODE,
        })
        .default('development'),
    PORT: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY })
        .transform(val => parseInt(val, 10))
        .refine(val => !Number.isNaN(val) && val > 0, {
            error: ERROR_MSG_POSITIVE_INTEGER,
        }),
    RESEND_API_KEY: z
        .string({ error: ERROR_MSG_NOT_PROVIDED })
        .min(1, { error: ERROR_MSG_IS_EMPTY }),
})
type EnvSchemaType = z.infer<typeof EnvSchema>

/**
 * Logs detailed validation errors.
 * This is called on startup if the environment variables are invalid.
 * @param error - The ZodSafeParseError containing all validation issues.
 */
const logOnInvalidEnv = (
    error: z.ZodSafeParseError<EnvSchemaType>['error'],
) => {
    log.error(ERROR_MSG_INVALID_ENV)
    for (const issue of error.issues) {
        const path = issue.path.join(ERROR_PATH_SEPARATOR) || ERROR_PATH_ROOT
        const message = issue.message
        log.error(`- ${path} : ${message}`)
    }
}

// Attempt to parse and validate the environment variables
const parsedEnv = EnvSchema.safeParse(process.env)

// If validation fails, log details and exit
if (!parsedEnv.success) {
    logOnInvalidEnv(parsedEnv.error)
    process.exit(EXIT_CODE_FAILURE)
}

/**
 * The type-safe, validated configuration object.
 * This is the "single source of truth" for all environment-based settings.
 */
export const config = {
    bcryptSaltRounds: parsedEnv.data.BCRYPT_SALT_ROUNDS,
    corsAllowedHeaders: parsedEnv.data.CORS_ALLOWED_HEADERS,
    corsMethods: parsedEnv.data.CORS_METHODS,
    corsOrigin: parsedEnv.data.CORS_ORIGIN,
    databaseUrl: parsedEnv.data.DATABASE_URL,
    directUrl: parsedEnv.data.DIRECT_URL,
    emailFrom: parsedEnv.data.EMAIL_FROM,
    frontendUrl: parsedEnv.data.FRONTEND_URL,
    jwtAccessExpiresIn: parsedEnv.data.JWT_ACCESS_EXPIRES_IN,
    jwtAccessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
    jwtRefreshExpiresIn: parsedEnv.data.JWT_REFRESH_EXPIRES_IN,
    jwtRefreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
    nodeEnv: parsedEnv.data.NODE_ENV,
    port: parsedEnv.data.PORT,
    resendApiKey: parsedEnv.data.RESEND_API_KEY,
}
