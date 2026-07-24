/**
 * Calendar Heatmap Component
 * Displays completed days on a monthly calendar grid.
 */

window.CalendarView = function() {
  const { calendarHistory, streak } = window.useGoals();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // First day of current month
  const firstDay = new Date(year, month, 1).getDay();
  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Build calendar matrix
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ empty: true });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isCompleted = !!calendarHistory[dStr];
    const isToday = day === today.getDate();
    cells.push({ day, dateStr: dStr, isCompleted, isToday });
  }

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Calendar Progress</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Visual monthly heatmap tracking your habit consistency.
          </p>
        </div>

        <div className="badge badge-flame" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          🔥 {streak.current} Days Streak
        </div>
      </div>

      <div className="glass-card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.4rem' }}>{monthNames[month]} {year}</h2>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(245, 158, 11, 0.6)' }}></span> Completed Day
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }}></span> Normal Day
            </span>
          </div>
        </div>

        {/* Days Header */}
        <div className="calendar-grid">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="calendar-day-header">{d}</div>
          ))}

          {/* Days Cells */}
          {cells.map((cell, idx) => {
            if (cell.empty) {
              return <div key={idx} className="calendar-day-cell empty"></div>;
            }
            return (
              <div 
                key={idx}
                className={`calendar-day-cell ${cell.isCompleted ? 'flame' : ''}`}
                style={{
                  border: cell.isToday ? '2px solid var(--primary)' : undefined
                }}
              >
                <span>{cell.day}</span>
                {cell.isCompleted && (
                  <span style={{ fontSize: '0.75rem', marginTop: 2 }}>🔥</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
