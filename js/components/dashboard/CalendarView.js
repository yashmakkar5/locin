/**
 * Calendar Heatmap Component (Phase 2 - Real Supabase Database Check-in Heatmap)
 */

const { useState, useEffect } = React;

window.CalendarView = function() {
  const { user } = window.useAuth();
  const { streak } = window.useGoals();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dbCheckIns, setDbCheckIns] = useState({});
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load check-in data from Supabase for selected month
  useEffect(() => {
    async function loadCalendarData() {
      if (!user) return;
      setLoading(true);
      try {
        const checkInMap = await window.goalService.fetchCalendarCheckIns(user.id, year, month);
        setDbCheckIns(checkInMap);
      } catch (err) {
        console.error("[CalendarView] Error loading check-ins:", err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCalendarData();
  }, [user, year, month]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ empty: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isCompleted = !!dbCheckIns[dStr];
    const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    const isPastMissed = !isCompleted && !isToday && new Date(dStr) < today;

    cells.push({ day, dateStr: dStr, isCompleted, isToday, isPastMissed });
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Calendar Progress Heatmap</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real check-in records fetched directly from your `daily_checkins` database table.
          </p>
        </div>

        <div className="badge badge-flame" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          🔥 {streak.current_streak || 0} Days Active Streak
        </div>
      </div>

      <div className="glass-card" style={{ padding: 32 }}>
        {/* Month Header & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h2 style={{ fontSize: '1.4rem' }}>{monthNames[month]} {year}</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-secondary btn-sm" onClick={prevMonth}>← Prev</button>
              <button className="btn btn-secondary btn-sm" onClick={nextMonth}>Next →</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(245, 158, 11, 0.6)' }}></span> Checked In
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(239, 68, 68, 0.25)', border: '1px solid rgba(239, 68, 68, 0.4)' }}></span> Missed
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, border: '2px solid var(--primary)' }}></span> Today
            </span>
          </div>
        </div>

        {loading ? (
          <window.LoadingSpinner message="Querying check-ins from database..." />
        ) : (
          <div className="calendar-grid">
            {daysOfWeek.map((d, i) => (
              <div key={i} className="calendar-day-header">{d}</div>
            ))}

            {cells.map((cell, idx) => {
              if (cell.empty) {
                return <div key={idx} className="calendar-day-cell empty"></div>;
              }
              return (
                <div 
                  key={idx}
                  className={`calendar-day-cell ${cell.isCompleted ? 'flame' : ''}`}
                  style={{
                    border: cell.isToday ? '2px solid var(--primary)' : undefined,
                    background: cell.isPastMissed ? 'rgba(239, 68, 68, 0.08)' : undefined,
                    borderColor: cell.isPastMissed ? 'rgba(239, 68, 68, 0.2)' : undefined
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
        )}
      </div>
    </div>
  );
};
