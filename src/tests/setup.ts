/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/setup.ts
 * @title Vitest Global Setup
 * @description This file is executed by Vitest before any tests run.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import path from 'node:path'
import { config as loadDotEnv } from 'dotenv'

// --- Constants ---

const ENV_FILE_NAME = '.env'

// --- Environment Setup ---

/**
 * Load environment variables from the .env file at the project root.
 * This ensures that `process.env` is populated before any application code
 * (like src/config/env.ts) is imported and executed by the tests.
 */
const envPath = path.resolve(process.cwd(), ENV_FILE_NAME)
loadDotEnv({ path: envPath })
