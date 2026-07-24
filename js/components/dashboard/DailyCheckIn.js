/**
 * Daily Check-In Component
 * Quick, satisfying daily habit check-in with confetti feedback.
 */

window.DailyCheckIn = function() {
  const { goals, streak, toggleSubtask, triggerDailyCheckIn } = window.useGoals();

  // Gather all subtasks across all goals
  const todaySubtasks = [];
  goals.forEach(goal => {
    goal.tasks.forEach(task => {
      task.subtasks.forEach(subtask => {
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
            Check off today's tasks to maintain your 🔥 fire streak momentum!
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
          <span>Complete Daily Check-in 🔥</span>
        </button>
      </div>

      {/* Streak Widget Banner */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '2.5rem' }}>🔥</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Current Streak: {streak.current} Days</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {completedCount} of {todaySubtasks.length} subtasks completed today
            </div>
          </div>
        </div>

        <div className="badge badge-flame" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Duolingo Momentum Active
        </div>
      </div>

      {/* Checklist */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 20 }}>Today's Task List</h3>

        {todaySubtasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No subtasks created yet. Add subtasks in Goal Management first.</p>
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
                    onClick={() => toggleSubtask(item.goalId, item.taskId, item.subtask.id)}
                    style={{ width: 24, height: 24 }}
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
