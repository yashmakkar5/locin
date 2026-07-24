/**
 * ============================================================================
 * AuthContext Provider (Phase 2 - Real Supabase Auth)
 * Handles session listener, protected route redirects, signup, login, logout.
 * ============================================================================
 */

const { createContext, useContext, useState, useEffect } = React;

const AuthContext = createContext();

window.AuthProvider = function({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'signup' | 'dashboard'

  // Initialize & Listen to Supabase Auth State Changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!window.isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        const client = window.getSupabaseClient();
        
        // 1. Get Initial Session
        const { data: { session: initialSession } } = await client.auth.getSession();
        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            setAuthView('dashboard');
          } else {
            setSession(null);
            setUser(null);
            setAuthView('landing');
          }
        }

        // 2. Register Auth Change Listener
        const { data: { subscription } } = client.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (mounted) {
              if (currentSession?.user) {
                setSession(currentSession);
                setUser(currentSession.user);
                setAuthView('dashboard');
              } else {
                setSession(null);
                setUser(null);
                setAuthView('landing');
              }
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error("[AuthContext] Initialization error:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await window.authService.signIn(email, password);
      setUser(loggedUser);
      setAuthView('dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, fullName) => {
    setLoading(true);
    try {
      const newUser = await window.authService.signUp(email, password, fullName);
      setUser(newUser);
      setAuthView('dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await window.authService.signInWithGoogle();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await window.authService.signOut();
    } catch (err) {
      console.error("[AuthContext] Logout error:", err.message);
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
