/**
 * ============================================================================
 * Authentication Service Module
 * Handles Email/Password Authentication, Google OAuth, and Session Management.
 * Includes clear Supabase integration hooks and Demo Mode fallback.
 * ============================================================================
 */

window.authService = {
  /**
   * Sign In with Email & Password
   */
  async signIn(email, password) {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE AUTH CONNECTION POINT:
         Call supabase.auth.signInWithPassword */
      const { data, error } = await window.supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data.user;
    }
    
    // DEMO FALLBACK: Simulate login
    const demoUser = {
      id: 'demo-user-123',
      name: email.split('@')[0] || 'Demo Student',
      email: email,
      avatarUrl: null,
      created_at: new Date().toISOString()
    };
    return demoUser;
  },

  /**
   * Sign Up with Email, Password & Full Name
   */
  async signUp(email, password, fullName) {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE AUTH CONNECTION POINT:
         Call supabase.auth.signUp with user metadata */
      const { data, error } = await window.supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      return data.user;
    }

    // DEMO FALLBACK: Simulate sign up
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      name: fullName || 'New Scholar',
      email: email,
      avatarUrl: null,
      created_at: new Date().toISOString()
    };
    return demoUser;
  },

  /**
   * Continue with Google OAuth
   */
  async signInWithGoogle() {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE AUTH OAUTH CONNECTION POINT:
         Call supabase.auth.signInWithOAuth for Google */
      const { data, error } = await window.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    }

    // DEMO FALLBACK: Simulate Google Auth
    const demoGoogleUser = {
      id: 'google-demo-777',
      name: 'Google Scholar',
      email: 'scholar.cse@google.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scholar',
      created_at: new Date().toISOString()
    };
    return demoGoogleUser;
  },

  /**
   * Sign Out current user
   */
  async signOut() {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE AUTH SIGN OUT: */
      const { error } = await window.supabase.auth.signOut();
      if (error) console.error("SignOut error:", error.message);
    }
  }
};
