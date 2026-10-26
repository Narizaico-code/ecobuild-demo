import type { SupabaseClient } from "@supabase/supabase-js";

// Demo sin red: nunca hay Supabase. Todo corre con el catálogo local (src/data).
export const supabaseConfigured = false;
export const supabase: SupabaseClient | null = null;
