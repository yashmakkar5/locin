/**
 * Authentication Page Component
 * Clean, minimalist auth card with mesh gradient backdrop,
 * quote banner, Google OAuth, Email/Password, and Demo Login.
 */

const { useState } = React;

window.AuthPage = function({ mode = 'login', onBackToLanding }) {
  const { login, signup, loginWithGoogle, loading } = window.useAuth();

  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('scholar@locin.edu');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Student Builder');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isSignUp) {
      const res = await signup(email, password, fullName);
      if (!res.success) setErrorMsg(res.error || 'Failed to sign up');
    } else {
      const res = await login(email, password);
      if (!res.success) setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const res = await loginWithGoogle();
    if (!res.success) setErrorMsg(res.error || 'Google login failed');
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-wrapper">
        {/* Left Side: Quote Overlay */}
        <div className="auth-quote-side">
          <div>
            <div className="logo-container" style={{ marginBottom: 40 }}>
              <div className="logo-icon">
                <i data-lucide="zap" style={{ color: '#fff' }}></i>
              </div>
              <span>locin</span>
            </div>
            
            <div style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: 12 }}>“</div>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 20 }}>
              "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times."
            </p>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Bruce Lee</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Martial Artist & Philosopher</div>
          </div>

          <div style={{ marginTop: 40 }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onBackToLanding}
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h2>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
            <p>{isSignUp ? 'Start tracking your goals in seconds' : 'Sign in to access your dashboard & streak'}</p>
          </div>

          {errorMsg && (
            <div className="btn-danger" style={{ padding: 10, borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="scholar@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="divider">OR</div>

          {/* Continue with Google Button */}
          <button 
            className="btn btn-google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="demo-banner">
            ⚡ <strong>Instant Demo Mode:</strong> Click Sign In or Google above to access the dashboard immediately without setup!
          </div>

          <div className="auth-footer">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <span className="auth-link" onClick={() => setIsSignUp(false)}>Sign In</span>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <span className="auth-link" onClick={() => setIsSignUp(true)}>Sign Up</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
