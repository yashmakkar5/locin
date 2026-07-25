/**
 * ============================================================================
 * Authentication Service Module (Phase 3 Audit & Debug Logging)
 * Handles Sign Up, Sign In, Google OAuth, Session Fetching, and Auto-Profile Sync.
 * ============================================================================
 */

window.authService = {
  /**
   * Register a new user with Email, Password, and Full Name
   */
  async signUp(email, password, fullName) {
    console.log("[Auth Debug] Signup attempt initiated for:", email);
    const client = window.getSupabaseClient();
    
    // 1. Trigger Supabase Auth Signup
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (authError) {
      console.error("[Auth Debug] ❌ Signup failed:", authError.message);
      throw authError;
    }

    const user = authData.user;
    const session = authData.session;

    console.log("[Auth Debug] ✅ Auth.signUp response received. User ID:", user?.id, "Session Active:", !!session);

    if (!user) {
      throw new Error("Registration failed. Please check your details and try again.");
    }

    // 2. If Session is Active (Email confirmation disabled or auto-confirmed)
    if (session) {
      try {
        await client.from('profiles').upsert({
          id: user.id,
          email: email,
          full_name: fullName || email.split('@')[0],
          created_at: new Date().toISOString()
        });

        await client.from('streaks').upsert({
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          last_checkin_date: null
        });
        console.log("[Auth Debug] ✅ Profile & Streak records created.");
      } catch (e) {
        console.warn("[Auth Debug] Inline profile creation notice:", e.message);
      }
      return { user, session, requireEmailConfirmation: false };
    }

    // 3. If Session is Null (Email confirmation required by Supabase Auth Settings)
    return {
      user,
      session: null,
      requireEmailConfirmation: true,
      message: "Account created successfully! Please check your email inbox to confirm your account before logging in, or disable 'Confirm email' in Supabase Auth settings to log in instantly."
    };
  },

  /**
   * Log in with Email & Password
   */
  async signIn(email, password) {
    console.log("[Auth Debug] Sign in attempt for:", email);
    const client = window.getSupabaseClient();
    
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("[Auth Debug] ❌ Sign in error:", error.message);
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Your email address has not been confirmed yet. Please check your email inbox or disable 'Confirm Email' in your Supabase Auth dashboard.");
      }
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password. Please verify your credentials or create a new account.");
      }
      throw error;
    }

    const user = data.user;
    const session = data.session;

    console.log("[Auth Debug] ✅ Sign in successful! User ID:", user?.id);

    // Auto-Ensure Profile and Streak records exist in DB
    if (user && session) {
      try {
        await client.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0]
        }, { onConflict: 'id' });

        await client.from('streaks').upsert({
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0
        }, { onConflict: 'user_id' });
      } catch (e) {
        console.warn("[Auth Debug] Post-login profile sync notice:", e.message);
      }
    }

    return { user, session };
  },

  /**
   * Trigger Google OAuth Authorization
   */
  async signInWithGoogle() {
    console.log("[Auth Debug] Initiating Google OAuth...");
    const client = window.getSupabaseClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      console.error("[Auth Debug] ❌ Google OAuth error:", error.message);
      throw error;
    }
    return data;
  },

  /**
   * Sign Out Current User Session
   */
  async signOut() {
    console.log("[Auth Debug] Initiating Sign Out...");
    const client = window.getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) {
      console.error("[Auth Debug] SignOut notice:", error.message);
    } else {
      console.log("[Auth Debug] ✅ User signed out successfully.");
    }
  },

  /**
   * Get Active Session
   */
  async getSession() {
    if (!window.isSupabaseConfigured()) return null;
    const client = window.getSupabaseClient();
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error("[Auth Debug] getSession error:", error.message);
      return null;
    }
    return data.session;
  }
};
