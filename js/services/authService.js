/**
 * ============================================================================
 * Authentication Service Module (Phase 2 - Real Supabase Auth)
 * Handles Email/Password Sign Up, Login, Google OAuth, and Session Syncing.
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
    if (!user) throw new Error("User creation failed. Please check your email and try again.");

    // 2. Create Profile Record in `profiles` table
    const { error: profileError } = await client
      .from('profiles')
      .upsert({
        id: user.id,
        email: email,
        full_name: fullName || email.split('@')[0],
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error("[authService] Profile creation warning:", profileError.message);
    }

    // 3. Initialize Streak Record in `streaks` table
    const { error: streakError } = await client
      .from('streaks')
      .upsert({
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        last_checkin_date: null
      });

    if (streakError) {
      console.error("[authService] Streak init warning:", streakError.message);
    }

    return user;
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
    if (error) throw error;
    return data.user;
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
    if (error) throw error;
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
