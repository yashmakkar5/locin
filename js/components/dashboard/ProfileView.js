/**
 * Profile View Component
 */

window.ProfileView = function() {
  const { user } = window.useAuth();
  const { streak, getStats } = window.useGoals();

  const stats = getStats();
  const name = user ? user.name : 'Scholar Student';
  const email = user ? user.email : 'scholar.cse@university.edu';

  const badges = [
    { title: 'Habit Starter', desc: 'Completed 1st daily check-in', icon: '⚡', unlocked: true },
    { title: '7-Day Streak Warrior', desc: 'Reached a 7-day fire streak', icon: '🔥', unlocked: streak.current >= 7 },
    { title: 'Goal Crusher', desc: 'Created overarching goals', icon: '🎯', unlocked: stats.totalGoals > 0 },
    { title: 'CSE Scholar', desc: '3rd Year Engineering Scholar', icon: '🎓', unlocked: true }
  ];

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Profile & Achievements</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Your personal scholar card and habit milestones.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28 }}>
        {/* User Card */}
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', margin: '0 auto 16px' }}>
            {name.charAt(0).toUpperCase()}
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{name}</h2>
          <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>3rd Year CSE Student</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{email}</p>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>🔥 Current Streak:</span>
              <span style={{ fontWeight: 700 }}>{streak.current} Days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>🎯 Total Goals:</span>
              <span style={{ fontWeight: 700 }}>{stats.totalGoals}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>📅 Joined Date:</span>
              <span>July 2026</span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="glass-card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 20 }}>Achievement Badges</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {badges.map((b, i) => (
              <div 
                key={i}
                style={{
                  padding: 20,
                  borderRadius: 'var(--radius-sm)',
                  background: b.unlocked ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: b.unlocked ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-color)',
                  opacity: b.unlocked ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{b.desc}</div>
                {b.unlocked && (
                  <span className="badge badge-success" style={{ marginTop: 10 }}>Unlocked</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
