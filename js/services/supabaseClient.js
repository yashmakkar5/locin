/**
 * ============================================================================
 * Supabase Client Initializer & Debugger Module (Phase 3 Production Audit)
 * Handles Environment Variable Resolution, Client Singleton, and Network Check.
 * ============================================================================
 */

// Environment variable resolution with fallback checks
window.SUPABASE_URL = 
  window.VITE_SUPABASE_URL || 
  window.SUPABASE_URL || 
  "https://igpyaffhsoxtzmupnekw.supabase.co";

window.SUPABASE_ANON_KEY = 
  window.VITE_SUPABASE_ANON_KEY || 
  window.SUPABASE_ANON_KEY || 
  "sb_publishable_v3TnyglbE7OMqGSEOe5kLw_JoEWTAnh";

/**
 * Verify configuration key validity
 */
window.isSupabaseConfigured = function() {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;
  const isValid = !!(
    url && 
    !url.includes("your-supabase-project") && 
    key && 
    !key.includes("your-supabase-anon-key")
  );
  return isValid;
};

// Client Singleton Instance
window.supabase = null;

function initializeSupabaseClient() {
  console.log("[Supabase Debug] Verifying credentials...");
  console.log("[Supabase Debug] Target URL:", window.SUPABASE_URL);

  if (window.supabaseJs && window.isSupabaseConfigured()) {
    try {
      window.supabase = window.supabaseJs.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );
      console.log("[Supabase Debug] ✅ Client successfully initialized.");
    } catch (err) {
      console.error("[Supabase Debug] ❌ Client initialization error:", err.message);
    }
  } else {
    console.warn(
      "[Supabase Debug] ⚠️ Supabase SDK or credentials missing. Running in limited mode."
    );
  }
}

// Execute initialization
initializeSupabaseClient();

/**
 * Reliable Client Retrieval Helper
 */
window.getSupabaseClient = function() {
  if (!window.supabase) {
    // Attempt re-initialization if missing
    initializeSupabaseClient();
  }
  if (!window.supabase) {
    throw new Error(
      "[Supabase Error] Unable to connect to Supabase. Please verify your internet connection, URL, and Anon Key."
    );
  }
  return window.supabase;
};
