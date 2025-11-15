/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/teardown.ts
 * @title Vitest Global Teardown
 * @description Provides a global afterAll hook to clean up resources.
 * @last-modified 2025-11-15
 */

// --- Imports ---
import { afterAll } from 'vitest'

// --- Global Teardown ---

/**
 * After all tests have run, clean up resources.
 */
afterAll(async () => {
    // Nothing to do for the moment
})
