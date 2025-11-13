/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/config/supabase.ts
 * @title Supabase Client Singleton
 * @description Initializes and exports the singleton Supabase client instance.
 * @last-modified 2025-11-13
 */

// --- Imports ---
import config from '@config/env.js'
import { createClient } from '@supabase/supabase-js'

// --- Constants ---

/**
 * Configuration options for the Supabase client.
 * These settings are generally recommended for server-side use.
 */
const SUPABASE_CLIENT_OPTIONS = {
    auth: {
        /** Automatically refresh the auth token when it expires. */
        autoRefreshToken: true,
        /** Disable parsing auth tokens from the URL (safer for server-side). */
        detectSessionInUrl: false,
        /**
         * Enable/disable session persistence.
         * Set to 'true' if you need to manage sessions, 'false' for stateless.
         */
        persistSession: true,
    },
}

/**
 * The singleton Supabase client instance.
 * This client is authenticated using the environment variables (URL and Anon Key)
 * and should be imported by any service or repository needing database access.
 */
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, SUPABASE_CLIENT_OPTIONS)
