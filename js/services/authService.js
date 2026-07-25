/**
 * ============================================================================
 * Authentication Service Module (Production Ready & Robust)
 * Handles Email/Password Sign Up, Sign In, Google OAuth, and Session Syncing.
 * Includes graceful handling for email confirmation requirements and auto-profile setup.
 * ============================================================================
 */

window.authService = {
  /**
   * Register a new user with Email, Password, and Full Name
   */
  async signUp(email, password, fullName) {
    const client = window.getSupabaseClient();
    
    // 1. Trigger Supabase Auth Signup
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (authError) throw authError;

    const user = authData.user;
    const session = authData.session;

    if (!user) {
      throw new Error("Registration failed. Please check your email and try again.");
    }

    // 2. If Session is present (Email Confirmation disabled / auto-confirmed)
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
      } catch (e) {
        console.warn("[authService] Inline profile setup notice:", e.message);
      }
      return { user, session, requireEmailConfirmation: false };
    }

    // 3. If Session is null (Email Confirmation is enabled in Supabase Auth Settings)
    return {
      user,
      session: null,
      requireEmailConfirmation: true,
      message: "Account created successfully! Please check your email inbox to confirm your account before signing in, or disable 'Confirm Email' in Supabase Auth settings."
    };
  },

  /**
   * Log in with Email & Password
   */
  async signIn(email, password) {
    const client = window.getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Your email address has not been confirmed yet. Please check your email inbox or disable 'Confirm Email' in your Supabase Auth dashboard.");
      }
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password. Please check your credentials or create a new account.");
      }
      throw error;
    }

    const user = data.user;
    const session = data.session;

    // Ensure Profile and Streak records exist in DB upon login
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
        console.warn("[authService] Post-login profile sync notice:", e.message);
      }
    }

    return { user, session };
  },

  /**
   * Trigger Google OAuth Authorization
   */
  async signInWithGoogle() {
    const client = window.getSupabaseClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign Out Current User Session
   */
  async signOut() {
    const client = window.getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) console.error("[authService] SignOut notice:", error.message);
  },

  /**
   * Get Active Session
   */
  async getSession() {
    if (!window.isSupabaseConfigured()) return null;
    const client = window.getSupabaseClient();
    const { data } = await client.auth.getSession();
    return data.session;
  }
};
