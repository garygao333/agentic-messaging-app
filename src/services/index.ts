import type { ApiClient } from './types';
import { mockApi } from './mockApi';
import { supabaseApi } from './supabaseApi';
import { supabaseConfigured } from './supabaseClient';

/**
 * Single switch between the mock and Supabase backends. The app defaults to
 * the mock so it runs with zero configuration; set EXPO_PUBLIC_USE_SUPABASE=true
 * (and the SUPABASE_* creds) to go live.
 */
export const useSupabase =
  process.env.EXPO_PUBLIC_USE_SUPABASE === 'true' && supabaseConfigured;

export const api: ApiClient = useSupabase ? supabaseApi : mockApi;

export type { ApiClient } from './types';
