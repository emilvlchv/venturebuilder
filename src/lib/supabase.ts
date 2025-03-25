
import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically injected by the Lovable Supabase integration
// When you connect your project to Supabase through the Lovable interface
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please connect your Supabase project through the Lovable interface.');
}

// Create a dummy client when not connected to Supabase yet
// This prevents runtime errors but authentication won't work until proper connection
const dummyUrl = 'https://placeholder-project.supabase.co';
const dummyKey = 'placeholder-key';

// Use actual values if available, otherwise use dummy values to prevent runtime errors
export const supabase = createClient(
  supabaseUrl || dummyUrl,
  supabaseAnonKey || dummyKey
);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
