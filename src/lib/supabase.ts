
import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically injected by the Lovable Supabase integration
// When you connect your project to Supabase through the Lovable interface
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please connect your Supabase project through the Lovable interface.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
