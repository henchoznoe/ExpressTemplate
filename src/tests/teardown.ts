/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/teardown.ts
 * @title Vitest Global Teardown
 * @description Provides a global afterAll hook to clean up resources (e.g., DB connection).
 * @last-modified 2025-11-14
 */

// --- Imports ---
import { supabase } from '@config/supabase.js'
import { afterAll } from 'vitest'

// --- Global Teardown ---

/**
 * After all tests have run, destroy the Supabase client connection.
 * This allows the Vitest process to exit gracefully.
 */
afterAll(async () => {
    await supabase.auth.signOut()
    await supabase.removeAllChannels()
})
