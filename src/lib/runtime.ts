/**
 * Leaf module (imports nothing from services/store) so both the store and the
 * service layer can read which backend is active without an import cycle.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && key);
export const useSupabaseBackend =
  process.env.EXPO_PUBLIC_USE_SUPABASE === 'true' && supabaseConfigured;
