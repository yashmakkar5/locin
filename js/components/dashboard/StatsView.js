/**
 * Statistics & Analytics Component
 */

window.StatsView = function() {
  const { getStats, streak } = window.useGoals();
  const stats = getStats();

  const weeklyData = [
    { day: 'Mon', count: 4, heightPct: 60 },
    { day: 'Tue', count: 6, heightPct: 85 },
    { day: 'Wed', count: 3, heightPct: 45 },
    { day: 'Thu', count: 7, heightPct: 100 },
    { day: 'Fri', count: 5, heightPct: 75 },
    { day: 'Sat', count: 8, heightPct: 95 },
    { day: 'Sun', count: 6, heightPct: 80 }
  ];

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Statistics & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Data-driven insights on your goals, subtask activity, and streak milestones.
          </p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: 28 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Completion Rate</p>
          <h2 style={{ fontSize: '2.4rem', margin: '8px 0' }} className="gradient-text">
            {stats.completionPercentage}%
          </h2>
          <div className="progress-bar-bg" style={{ margin: '8px 0 0' }}>
            <div className="progress-bar-fill" style={{ width: `${stats.completionPercentage}%` }}></div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tasks Checked Off</p>
          <h2 style={{ fontSize: '2.4rem', margin: '8px 0' }}>
            {stats.completedSubtasks} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.totalSubtasks}</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
            ✓ High daily consistency rate
          </p>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Streak Record</p>
          <h2 style={{ fontSize: '2.4rem', margin: '8px 0' }} className="gradient-flame">
            🔥 {streak.longest} Days
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Current: {streak.current} Days Unstoppable
          </p>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="glass-card" style={{ padding: 32 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Weekly Activity Trend</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
          Number of daily subtasks completed per day over the past week:
        </p>

        <div className="bar-chart-container">
          {weeklyData.map((item, idx) => (
            <div key={idx} className="chart-bar-group">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{item.count}</span>
              <div className="chart-bar-track">
                <div className="chart-bar-fill" style={{ height: `${item.heightPct}%` }}></div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
