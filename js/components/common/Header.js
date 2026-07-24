/**
 * Navbar Header Component for Landing Page
 */

window.Header = function({ onNavigateAuth }) {
  return (
    <header className="landing-header">
      <a href="#" className="logo-container">
        <div className="logo-icon">
          <i data-lucide="zap" style={{ color: '#fff' }}></i>
        </div>
        <span>locin</span>
      </a>

      <nav className="nav-links">
        <a href="#features" className="nav-link">Features</a>
        <a href="#motivation" className="nav-link">Motivation</a>
        <a href="#compounding" className="nav-link">Why It Works</a>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigateAuth('login')}
        >
          Sign In
        </button>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => onNavigateAuth('signup')}
        >
          Get Started
        </button>
      </nav>
    </header>
  );
};
