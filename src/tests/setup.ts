/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/setup.ts
 * @title Vitest Global Setup
 * @description This file is executed by Vitest before any tests run to load environment variables.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import path from 'node:path'
import { config as loadDotEnv } from 'dotenv'

// --- Constants ---
const ENV_FILE_NAME = '.env'

// --- Environment Setup ---
const envPath = path.resolve(process.cwd(), ENV_FILE_NAME)
const result = loadDotEnv({ path: envPath })

if (result.error) {
    console.error('Error loading .env file in setup.ts:', result.error)
    process.exit(1)
}
