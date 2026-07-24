/**
 * Profile View Component (Phase 2 - Real Supabase User Profile & Updates)
 */

const { useState } = React;

window.ProfileView = function() {
  const { user } = window.useAuth();
  const { profile, streak, getStats, updateUserProfile, feedbackBanner, errorBanner } = window.useGoals();

  const stats = getStats();
  const initialName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  
  const [nameInput, setNameInput] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const email = user?.email || 'N/A';
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today';

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setSaving(true);
    await updateUserProfile(nameInput.trim());
    setSaving(false);
    setIsEditing(false);
  };

  const badges = [
    { title: 'Habit Starter', desc: 'Completed 1st daily check-in', icon: '⚡', unlocked: (streak.current_streak > 0 || streak.longest_streak > 0) },
    { title: '7-Day Streak Warrior', desc: 'Reached a 7-day fire streak', icon: '🔥', unlocked: streak.current_streak >= 7 || streak.longest_streak >= 7 },
    { title: 'Goal Crusher', desc: 'Created goals in database', icon: '🎯', unlocked: stats.totalGoals > 0 },
    { title: 'Supabase Scholar', desc: 'Connected to Supabase PostgreSQL', icon: '🎓', unlocked: true }
  ];

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Profile & Achievements</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            User information and milestones loaded from Supabase backend.
          </p>
        </div>
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 28 }}>
        {/* Profile Identity Card */}
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', margin: '0 auto 16px' }}>
            {initialName ? initialName.charAt(0).toUpperCase() : 'U'}
          </div>

          {!isEditing ? (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{initialName || 'Scholar'}</h2>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => { setNameInput(initialName); setIsEditing(true); }}
                style={{ margin: '8px 0 16px' }}
              >
                ✏️ Edit Name
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateName} style={{ marginBottom: 16 }}>
              <input 
                type="text"
                className="form-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{ textAlign: 'center', marginBottom: 8 }}
                required
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{email}</p>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>🔥 Current Streak:</span>
              <span style={{ fontWeight: 700 }}>{streak.current_streak || 0} Days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>⚡ Longest Streak:</span>
              <span style={{ fontWeight: 700 }}>{streak.longest_streak || 0} Days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>🎯 Total Goals:</span>
              <span style={{ fontWeight: 700 }}>{stats.totalGoals}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>📌 Tasks Completed:</span>
              <span style={{ fontWeight: 700 }}>{stats.completedTasks} / {stats.totalTasks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>📅 Joined Date:</span>
              <span>{joinDate}</span>
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
                {b.unlocked ? (
                  <span className="badge badge-success" style={{ marginTop: 10 }}>Unlocked</span>
                ) : (
                  <span className="badge" style={{ marginTop: 10, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-subtle)' }}>Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
