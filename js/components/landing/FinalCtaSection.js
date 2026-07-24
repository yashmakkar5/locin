/**
 * Landing Page Final CTA Section
 */

window.FinalCtaSection = function({ onNavigateAuth }) {
  return (
    <section className="final-cta">
      <div className="glass-card final-cta-card">
        <span className="badge badge-primary">Ready to Level Up?</span>

        <h2 style={{ fontSize: '2.5rem', lineHeight: 1.2 }}>
          Start Building <span className="gradient-text">Better Habits Today</span>
        </h2>

        <p style={{ color: 'var(--text-muted)', maxWidth: 550 }}>
          Join thousands of students and developers using Locin to track their daily goals, build unstoppable fire streaks, and compound their success.
        </p>

        <button 
          className="btn btn-primary" 
          style={{ padding: '14px 32px', fontSize: '1.05rem' }}
          onClick={() => onNavigateAuth('login')}
        >
          <span>Start Building Better Habits</span>
          <i data-lucide="arrow-right" style={{ width: 20, height: 20 }}></i>
        </button>
      </div>
    </section>
  );
};
