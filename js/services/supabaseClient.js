/**
 * ============================================================================
 * Supabase Client Initialization & Configuration Module
 * Author: 3rd Year CSE Engineering Project
 * 
 * INSTRUCTIONS FOR CONNECTING SUPABASE:
 * 1. Create a free project at https://supabase.com
 * 2. Copy your Project URL and Anon Public Key from Project Settings > API.
 * 3. Set the environment variables below or pass them directly to createClient.
 * ============================================================================
 */

// Placeholder Environment Variables (Replace with your actual keys when deploying)
window.SUPABASE_CONFIG = {
  URL: window.VITE_SUPABASE_URL || "https://your-supabase-project-id.supabase.co",
  ANON_KEY: window.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key-placeholder"
};

/**
 * Check if Supabase is properly configured with real credentials.
 */
window.isSupabaseConfigured = function() {
  const url = window.SUPABASE_CONFIG.URL;
  const key = window.SUPABASE_CONFIG.ANON_KEY;
  return url && !url.includes("your-supabase-project-id") && key && !key.includes("your-supabase-anon-key");
};

/**
 * Supabase Client Singleton Instance
 * Loaded conditionally via Supabase JS SDK CDN or NPM package.
 */
window.supabase = null;

if (window.supabaseJs && window.isSupabaseConfigured()) {
  try {
    window.supabase = window.supabaseJs.createClient(
      window.SUPABASE_CONFIG.URL,
      window.SUPABASE_CONFIG.ANON_KEY
    );
    console.log("[Supabase] Connected successfully to:", window.SUPABASE_CONFIG.URL);
  } catch (err) {
    console.warn("[Supabase] Client initialization error:", err.message);
  }
} else {
  console.log("[Locin App] Running in Demo Mode with LocalStorage persistence.");
}
