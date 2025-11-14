/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file vitest.config.ts
 * @title Vitest Configuration
 * @description Configures the Vitest test runner for the project.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// --- Constants ---

/**
 * Path to the global setup file for Vitest.
 * This file runs before all tests (e..g, to load .env files).
 */
const SETUP_FILES = [
    './src/tests/setup.ts', // 1. Load environment variables FIRST
    './src/tests/teardown.ts', // 2. Register the global teardown hook
]

// --- Vitest Configuration ---

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        /**
         * Specifies the environment for the tests.
         * 'node' simulates a Node.js environment.
         */
        environment: 'node',
        /**
         * Enables global test APIs (describe, it, expect, vi)
         * so they don't need to be imported in every test file.
         */
        globals: true,
        /**
         * A list of files to run before any tests are executed.
         * Used here to load environment variables.
         */
        setupFiles: SETUP_FILES, // <-- Changement ici
    },
})
