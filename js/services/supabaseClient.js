/**
 * ============================================================================
 * Supabase Client Initializer Module (Phase 2 - Production Backend)
 * ============================================================================
 */

// Environment configuration keys (Passed via window or .env)
window.SUPABASE_URL = window.VITE_SUPABASE_URL || "https://your-supabase-project.supabase.co";
window.SUPABASE_ANON_KEY = window.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";

/**
 * Check if valid Supabase URL & Key are set
 */
window.isSupabaseConfigured = function() {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;
  return (
    url && 
    !url.includes("your-supabase-project") && 
    key && 
    !key.includes("your-supabase-anon-key")
  );
};

// Singleton Client Reference
window.supabase = null;

if (window.supabaseJs && window.isSupabaseConfigured()) {
  try {
    window.supabase = window.supabaseJs.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );
    console.log("[Supabase Client] Successfully initialized connection to:", window.SUPABASE_URL);
  } catch (err) {
    console.error("[Supabase Client] Initialization failure:", err.message);
  }
} else {
  console.warn(
    "[Supabase Client] Credentials missing. Please update window.SUPABASE_URL and window.SUPABASE_ANON_KEY in js/services/supabaseClient.js or set environment variables."
  );
}

/**
 * Helper to ensure Supabase client is ready before making DB queries
 */
window.getSupabaseClient = function() {
  if (!window.supabase) {
    throw new Error(
      "Supabase client is not connected. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to js/services/supabaseClient.js or your environment configuration."
    );
  }
  return window.supabase;
};
