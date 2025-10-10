import config from './env.js';
import { createClient } from '@supabase/supabase-js';

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, options);
