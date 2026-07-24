/**
 * Landing Page Hero Section
 */

window.HeroSection = function({ onNavigateAuth }) {
  return (
    <section className="hero-section">
      <div className="hero-pill">
        <span className="badge badge-primary">
          <i data-lucide="sparkles" style={{ width: 14, height: 14 }}></i>
          Next-Gen Goal Tracking System
        </span>
      </div>

      <h1 className="hero-title">
        Small actions. <br />
        <span className="gradient-text">Massive results.</span>
      </h1>

      <p className="hero-subtitle">
        Transform your ambitions into daily compounding victories. Set structured goals, check in seamlessly, and watch your 🔥 fire streak grow.
      </p>

      <div className="hero-cta-group">
        <button 
          className="btn btn-primary"
          onClick={() => onNavigateAuth('signup')}
        >
          <span>Start Your Journey</span>
          <i data-lucide="arrow-right" style={{ width: 18, height: 18 }}></i>
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => onNavigateAuth('login')}
        >
          Get Started
        </button>
      </div>

      {/* Floating 3D-Style Glass Visual Cards */}
      <div className="hero-visual">
        <div className="glass-card floating-card animate-float" style={{ animationDelay: '0s' }}>
          <div className="floating-card-icon">🧠</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Learn AI & ML</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Python Basics • Variables</div>
            <div className="badge badge-success" style={{ marginTop: 6 }}>92% Completed</div>
          </div>
        </div>

        <div className="glass-card floating-card animate-float" style={{ animationDelay: '1.5s', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <div className="floating-card-icon">🔥</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Active Streak</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }} className="gradient-flame">7 Days Unstoppable</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Duolingo-inspired Momentum</div>
          </div>
        </div>

        <div className="glass-card floating-card animate-float" style={{ animationDelay: '3s' }}>
          <div className="floating-card-icon">📅</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Calendar Progress</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>28 Days Checked In</div>
            <div className="badge badge-primary" style={{ marginTop: 6 }}>Perfect Monthly Consistency</div>
          </div>
        </div>
      </div>
    </section>
  );
};
