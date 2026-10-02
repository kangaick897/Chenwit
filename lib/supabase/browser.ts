import { createBrowserClient } from "@supabase/ssr";

function getSupabaseBrowserConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase browser environment variables.");
  }

  return { supabaseUrl, supabaseKey };
}

export function createBrowserSupabaseClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseBrowserConfig();

  return createBrowserClient(supabaseUrl, supabaseKey);
}
