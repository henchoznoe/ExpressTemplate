import { createClient } from '@supabase/supabase-js'
import config from './env.js'

const options = {
    auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
    },
}

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, options)
