
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the Supabase client from integrations/supabase/client.ts
// which is automatically generated with the correct credentials
export const supabase = supabaseClient;

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // We're now using the automatically generated client which always has the credentials
};
