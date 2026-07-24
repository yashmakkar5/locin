/**
 * ============================================================================
 * AuthContext Provider
 * Global React Context managing user authentication state, current user,
 * login modal visibility, and auth events.
 * ============================================================================
 */

const { createContext, useContext, useState, useEffect } = React;

const AuthContext = createContext();

window.AuthProvider = function({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('locin_active_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'auth' | 'dashboard'

  useEffect(() => {
    if (user && authView === 'landing') {
      setAuthView('dashboard');
    }
  }, []);

  // Listen to Supabase Auth State Changes if connected
  useEffect(() => {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE AUTH LISTENER: Automatically handles login redirect / token changes */
      const { data: { subscription } } = window.supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            const formattedUser = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              email: session.user.email,
              avatarUrl: session.user.user_metadata?.avatar_url || null
            };
            setUser(formattedUser);
            localStorage.setItem('locin_active_user', JSON.stringify(formattedUser));
            setAuthView('dashboard');
          } else {
            setUser(null);
            localStorage.removeItem('locin_active_user');
          }
        }
      );

      return () => subscription?.unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await window.authService.signIn(email, password);
      setUser(loggedUser);
      localStorage.setItem('locin_active_user', JSON.stringify(loggedUser));
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
      localStorage.setItem('locin_active_user', JSON.stringify(newUser));
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
      const googleUser = await window.authService.signInWithGoogle();
      if (googleUser && !window.isSupabaseConfigured()) {
        setUser(googleUser);
        localStorage.setItem('locin_active_user', JSON.stringify(googleUser));
        setAuthView('dashboard');
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await window.authService.signOut();
    setUser(null);
    localStorage.removeItem('locin_active_user');
    setAuthView('landing');
  };

  const value = {
    user,
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
