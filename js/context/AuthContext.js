/**
 * ============================================================================
 * AuthContext Provider (Phase 3 Audit - Production Guaranteed Safety)
 * Handles session listener, timeout guards, protected routes, and debug logs.
 * ============================================================================
 */

const { createContext, useContext, useState, useEffect } = React;

const AuthContext = createContext();

window.AuthProvider = function({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'signup' | 'dashboard'

  useEffect(() => {
    let mounted = true;
    console.log("[Auth Context Debug] Initializing Auth Provider...");

    // Safety Timeout Guard: Ensures loading state is turned OFF within 4 seconds max
    const safetyTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn("[Auth Context Debug] ⚠️ Safety timeout triggered. Releasing loading state.");
        setLoading(false);
      }
    }, 4000);

    async function initAuth() {
      if (!window.isSupabaseConfigured()) {
        console.warn("[Auth Context Debug] Supabase unconfigured. Stopping auth init.");
        if (mounted) setLoading(false);
        return;
      }

      try {
        const client = window.getSupabaseClient();
        
        // 1. Fetch current active session
        console.log("[Auth Context Debug] Fetching initial session...");
        const { data: { session: initialSession }, error } = await client.auth.getSession();
        
        if (error) {
          console.error("[Auth Context Debug] Error fetching session:", error.message);
        }

        if (mounted) {
          if (initialSession?.user) {
            console.log("[Auth Context Debug] ✅ Active session restored for:", initialSession.user.email);
            setSession(initialSession);
            setUser(initialSession.user);
            setAuthView('dashboard');
          } else {
            console.log("[Auth Context Debug] No active session found.");
            setSession(null);
            setUser(null);
            setAuthView(prev => (prev === 'dashboard' ? 'landing' : prev));
          }
        }

        // 2. Listen to authentication state changes
        const { data: { subscription } } = client.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log(`[Auth Context Debug] Auth State Changed Event: [${event}]`);

            if (!mounted) return;

            if (currentSession?.user) {
              console.log("[Auth Context Debug] Active user session set:", currentSession.user.email);
              setSession(currentSession);
              setUser(currentSession.user);
              setAuthView('dashboard');
            } else {
              console.log("[Auth Context Debug] Session cleared.");
              setSession(null);
              setUser(null);
              if (event === 'SIGNED_OUT') {
                setAuthView('landing');
              }
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error("[Auth Context Debug] Initialization catch:", err.message);
      } finally {
        clearTimeout(safetyTimer);
        if (mounted) {
          console.log("[Auth Context Debug] Releasing loading spinner.");
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  const login = async (email, password) => {
    console.log("[Auth Context Debug] Executing login for:", email);
    setLoading(true);
    try {
      const res = await window.authService.signIn(email, password);
      if (res?.user && res?.session) {
        setUser(res.user);
        setSession(res.session);
        setAuthView('dashboard');
        return { success: true };
      }
      return { success: false, error: "Login failed. Please verify credentials." };
    } catch (err) {
      console.error("[Auth Context Debug] Login exception:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, fullName) => {
    console.log("[Auth Context Debug] Executing signup for:", email);
    setLoading(true);
    try {
      const res = await window.authService.signUp(email, password, fullName);
      
      if (res.requireEmailConfirmation) {
        return { 
          success: false, 
          requireEmailConfirmation: true, 
          message: res.message 
        };
      }

      if (res.user && res.session) {
        setUser(res.user);
        setSession(res.session);
        setAuthView('dashboard');
        return { success: true };
      }

      return { success: true, message: "Account created! You can now sign in." };
    } catch (err) {
      console.error("[Auth Context Debug] Signup exception:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    console.log("[Auth Context Debug] Executing Google OAuth...");
    setLoading(true);
    try {
      await window.authService.signInWithGoogle();
      return { success: true };
    } catch (err) {
      console.error("[Auth Context Debug] Google OAuth exception:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("[Auth Context Debug] Executing Logout...");
    setLoading(true);
    try {
      await window.authService.signOut();
    } catch (err) {
      console.error("[Auth Context Debug] Logout notice:", err.message);
    } finally {
      setUser(null);
      setSession(null);
      setAuthView('landing');
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    authView,
    setAuthView,
    login,
    signup,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

window.useAuth = function() {
  return useContext(AuthContext);
};
