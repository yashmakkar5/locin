/**
 * ============================================================================
 * AuthContext Provider (Production Ready)
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

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!window.isSupabaseConfigured()) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const client = window.getSupabaseClient();
        
        // 1. Fetch current active session
        const { data: { session: initialSession } } = await client.auth.getSession();
        
        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            setAuthView('dashboard');
          } else {
            setSession(null);
            setUser(null);
            // Retain requested authView if user clicked login/signup
            setAuthView(prev => (prev === 'dashboard' ? 'landing' : prev));
          }
        }

        // 2. Listen to authentication changes
        const { data: { subscription } } = client.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!mounted) return;

            if (currentSession?.user) {
              setSession(currentSession);
              setUser(currentSession.user);
              setAuthView('dashboard');
            } else if (event === 'SIGNED_OUT') {
              setSession(null);
              setUser(null);
              setAuthView('landing');
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error("[AuthContext] Initialization notice:", err.message);
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
      const res = await window.authService.signIn(email, password);
      if (res?.user) {
        setUser(res.user);
        setSession(res.session);
        setAuthView('dashboard');
        return { success: true };
      }
      return { success: false, error: "Login failed. Please try again." };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, fullName) => {
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
      console.error("[AuthContext] Logout notice:", err.message);
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
