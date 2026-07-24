/**
 * Daily Check-In Component (Phase 2 - Real Supabase Database Check-in)
 */

window.DailyCheckIn = function() {
  const { goals, streak, toggleSubtask, triggerDailyCheckIn, feedbackBanner, errorBanner } = window.useGoals();

  // Gather subtasks across user's goals
  const todaySubtasks = [];
  goals.forEach(goal => {
    (goal.tasks || []).forEach(task => {
      (task.subtasks || []).forEach(subtask => {
        todaySubtasks.push({
          goalId: goal.id,
          goalTitle: goal.title,
          taskId: task.id,
          taskTitle: task.title,
          subtask
        });
      });
    });
  });

  const completedCount = todaySubtasks.filter(item => item.subtask.completed).length;

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Daily Check-in</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Complete today's check-in to record your progress and grow your 🔥 fire streak!
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={triggerDailyCheckIn}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            boxShadow: 'var(--shadow-flame)'
          }}
        >
          <span>Submit Today's Check-in 🔥</span>
        </button>
      </div>

      {/* Feedback / Error Messages */}
      {errorBanner && (
        <div className="btn-danger" style={{ padding: 12, borderRadius: 8, marginBottom: 20, fontSize: '0.85rem' }}>
          ⚠️ {errorBanner}
        </div>
      )}
      {feedbackBanner && (
        <div className="badge badge-success" style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 20, fontSize: '0.9rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {feedbackBanner}
        </div>
      )}

      {/* Streak Widget Banner */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '2.5rem' }}>🔥</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Current Streak: {streak.current_streak || 0} Days</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {completedCount} of {todaySubtasks.length} subtasks completed in database
            </div>
          </div>
        </div>

        <div className="badge badge-flame" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Longest Record: {streak.longest_streak || 0} Days
        </div>
      </div>

      {/* Checklist */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 20 }}>Today's Action Checklist</h3>

        {todaySubtasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No subtasks created yet. Add goals and subtasks in Goal Management first.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {todaySubtasks.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify-content: 'space-between',
                  padding: '14px 18px',
                  background: item.subtask.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid',
                  borderColor: item.subtask.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div 
                    className={`custom-checkbox ${item.subtask.completed ? 'checked' : ''}`}
                    onClick={() => toggleSubtask(item.goalId, item.taskId, item.subtask.id, item.subtask.completed)}
                    style={{ width: 24, height: 24 }}
                    role="button"
                    tabIndex={0}
                  >
                    {item.subtask.completed && '✓'}
                  </div>

                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      textDecoration: item.subtask.completed ? 'line-through' : 'none',
                      color: item.subtask.completed ? 'var(--text-subtle)' : 'var(--text-main)'
                    }}>
                      {item.subtask.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      🎯 {item.goalTitle} → 📌 {item.taskTitle}
                    </div>
                  </div>
                </div>

                {item.subtask.completed && (
                  <span className="badge badge-success">Done</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
