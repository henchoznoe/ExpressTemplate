import config from '@config/env.js'
import { createClient } from '@supabase/supabase-js'

const options = {
    auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
    },
}

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, options)
