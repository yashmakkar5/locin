/**
 * Dashboard Home View Component (Phase 2 - Real Live Data)
 */

window.DashboardHome = function({ setActiveTab }) {
  const { user } = window.useAuth();
  const { streak, profile, getStats, triggerDailyCheckIn, dataLoading, errorBanner, feedbackBanner } = window.useGoals();

  const stats = getStats();
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Scholar';

  return (
    <div>
      {/* Top Greeting Header */}
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>
            Welcome back, <span className="gradient-text">{displayName}</span>! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Here is your real-time performance overview from Supabase.
          </p>
        </div>

        <div className="user-profile-badge">
          <div className="avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{displayName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Banners */}
      {errorBanner && (
        <div className="btn-danger" style={{ padding: 14, borderRadius: 10, marginBottom: 20, fontSize: '0.9rem' }}>
          ⚠️ {errorBanner}
        </div>
      )}
      {feedbackBanner && (
        <div className="badge badge-success" style={{ padding: '10px 16px', borderRadius: 10, marginBottom: 20, fontSize: '0.9rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {feedbackBanner}
        </div>
      )}

      {dataLoading ? (
        <window.LoadingSpinner message="Syncing metrics with Supabase..." />
      ) : (
        <>
          {/* Fire Streak Duolingo Widget */}
          <div className="streak-widget">
            <div className="streak-count-display">
              <div className="fire-badge-large">🔥</div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#fcd34d', fontWeight: 600 }}>CURRENT FIRE STREAK</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }} className="gradient-flame">
                  {streak.current_streak || 0} Days Active
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Longest Streak Record: {streak.longest_streak || 0} Days ⚡
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={triggerDailyCheckIn}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                boxShadow: 'var(--shadow-flame)'
              }}
            >
              <span>Daily Check-in 🔥</span>
            </button>
          </div>

          {/* Metrics Cards Grid */}
          <div className="metrics-grid">
            <div className="glass-card metric-card">
              <div className="metric-info">
                <p>Total Goals</p>
                <h3>{stats.totalGoals}</h3>
              </div>
              <div className="metric-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
                <i data-lucide="target" style={{ width: 24, height: 24 }}></i>
              </div>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-info">
                <p>Tasks Completed</p>
                <h3>{stats.completedTasks} / {stats.totalTasks}</h3>
              </div>
              <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
                <i data-lucide="check-circle-2" style={{ width: 24, height: 24 }}></i>
              </div>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-info">
                <p>Completion Rate</p>
                <h3>{stats.completionPercentage}%</h3>
              </div>
              <div className="metric-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                <i data-lucide="trending-up" style={{ width: 24, height: 24 }}></i>
              </div>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-info">
                <p>Longest Streak</p>
                <h3>{stats.longestStreak} Days</h3>
              </div>
              <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d' }}>
                <i data-lucide="award" style={{ width: 24, height: 24 }}></i>
              </div>
            </div>
          </div>

          {/* Today's Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="glass-card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Today's Completion Progress</h3>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${stats.completionPercentage}%` }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>{stats.completedSubtasks} of {stats.totalSubtasks} subtasks checked off</span>
                <span>{stats.completionPercentage}%</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Goal Action Center</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Create overarching goals, break them down into subtasks, and track your history.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('goals')}>
                  Manage Goals →
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('calendar')}>
                  View Calendar →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
