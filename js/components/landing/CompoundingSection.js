/**
 * Landing Page Interactive Compounding Calculator Section
 */

const { useState } = React;

window.CompoundingSection = function() {
  const [dailyPct, setDailyPct] = useState(1); // 1% better per day

  // Formula: (1 + pct/100)^365
  const calculateGrowth = (pct) => {
    return Math.pow(1 + pct / 100, 365).toFixed(1);
  };

  const calculateDecline = (pct) => {
    return Math.pow(1 - pct / 100, 365).toFixed(2);
  };

  const growthFactor = calculateGrowth(dailyPct);
  const declineFactor = calculateDecline(dailyPct);

  return (
    <section id="compounding" className="section-container">
      <div className="section-header">
        <span className="badge badge-success" style={{ marginBottom: 12 }}>The Math of Success</span>
        <h2 className="section-title">Why Small Habits Compound</h2>
        <p className="section-description">
          Improving just {dailyPct}% every single day yields exponential results by the end of the year.
        </p>
      </div>

      <div className="compounding-wrapper">
        <div className="glass-card compounding-card">
          <h3>Interactive Compounding Calculator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Adjust your daily effort percentage to see your 365-day projected growth:
          </p>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 600 }}>
              <span>Daily Effort Increase:</span>
              <span className="gradient-text">{dailyPct}% per day</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1" 
              value={dailyPct}
              onChange={(e) => setDailyPct(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--primary)',
                height: 6,
                cursor: 'pointer'
              }}
            />
          </div>

          <div className="stat-box-group">
            <div className="stat-box" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                1.0{dailyPct}³⁶⁵ (1% Better Every Day)
              </div>
              <div className="stat-val" style={{ color: '#6ee7b7' }}>
                {growthFactor}x
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: 4 }}>
                Exponential Success
              </div>
            </div>

            <div className="stat-box" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                0.99³⁶⁵ (1% Worse Every Day)
              </div>
              <div className="stat-val" style={{ color: '#fca5a5' }}>
                {declineFactor}x
              </div>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>
                Stagnation
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--primary)' }}>
              🎯 1. Systems Over Intensity
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Unfocused intense effort leads to burnout. Locin structures your goals into small daily subtasks that take minutes to check off, creating sustainable momentum.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 28 }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--accent-flame)' }}>
              🔥 2. The Power of Streaks
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Visual streak counters trigger dopamine loops. Once you build a 7-day streak, you won't want to break the chain.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 28 }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--secondary)' }}>
              📈 3. Clear Visual Feedback
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Our calendar heatmaps and statistics charts give you immediate proof of your progress every week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
