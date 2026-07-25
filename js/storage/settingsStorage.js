/**
 * ============================================================================
 * Settings Storage Module (Profile, Preferences & Load Demo Data Handler)
 * ============================================================================
 */

window.settingsStorage = {
  /**
   * Fetch Profile info
   */
  getProfile() {
    const store = window.storageManager.getStore();
    return store.profile || { name: 'Scholar Student', email: 'local.scholar@device' };
  },

  /**
   * Update Profile Name
   */
  updateProfile(name) {
    const store = window.storageManager.getStore();
    store.profile = { ...(store.profile || {}), name: name.trim() };
    window.storageManager.saveStore(store);
    return store.profile;
  },

  /**
   * Intentionally populate Demo Goals ONLY when requested by user in Settings
   */
  loadDemoData() {
    const store = window.storageManager.getStore();

    const sampleGoals = [
      {
        id: window.storageManager.generateUUID(),
        title: 'Learn AI & Machine Learning',
        category: 'Technology',
        color: '#6366f1',
        created_at: new Date().toISOString(),
        tasks: [
          {
            id: window.storageManager.generateUUID(),
            title: 'Python Basics',
            completed: false,
            created_at: new Date().toISOString(),
            subtasks: [
              { id: window.storageManager.generateUUID(), title: 'Variables & Data Types', completed: true, created_at: new Date().toISOString() },
              { id: window.storageManager.generateUUID(), title: 'Loops & Conditionals', completed: true, created_at: new Date().toISOString() },
              { id: window.storageManager.generateUUID(), title: 'Functions & Modules', completed: false, created_at: new Date().toISOString() }
            ]
          },
          {
            id: window.storageManager.generateUUID(),
            title: 'Machine Learning Fundamentals',
            completed: false,
            created_at: new Date().toISOString(),
            subtasks: [
              { id: window.storageManager.generateUUID(), title: 'Linear & Logistic Regression', completed: false, created_at: new Date().toISOString() },
              { id: window.storageManager.generateUUID(), title: 'Classification Algorithms', completed: false, created_at: new Date().toISOString() }
            ]
          }
        ]
      },
      {
        id: window.storageManager.generateUUID(),
        title: 'Peak Physical Fitness',
        category: 'Health',
        color: '#ec4899',
        created_at: new Date().toISOString(),
        tasks: [
          {
            id: window.storageManager.generateUUID(),
            title: 'Daily Fitness Protocol',
            completed: true,
            created_at: new Date().toISOString(),
            subtasks: [
              { id: window.storageManager.generateUUID(), title: '30 Mins Morning Workout', completed: true, created_at: new Date().toISOString() },
              { id: window.storageManager.generateUUID(), title: 'Hydrate 3 Liters Water', completed: true, created_at: new Date().toISOString() },
              { id: window.storageManager.generateUUID(), title: 'Post-Workout Stretching', completed: true, created_at: new Date().toISOString() }
            ]
          }
        ]
      }
    ];

    store.goals = sampleGoals;
    window.storageManager.saveStore(store);
    return sampleGoals;
  },

  /**
   * Export all storage as JSON download
   */
  exportBackup() {
    const store = window.storageManager.getStore();
    const todayStr = new Date().toISOString().split('T')[0];
    const filename = `locin-backup-${todayStr}.json`;

    const jsonStr = JSON.stringify(store, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Import storage from JSON file
   */
  importBackup(fileContent) {
    try {
      const parsed = JSON.parse(fileContent);

      if (!parsed || typeof parsed !== 'object') {
        throw new Error("Invalid file format. File is not a valid JSON object.");
      }

      if (!parsed.goals || !Array.isArray(parsed.goals)) {
        throw new Error("Invalid backup file: Missing 'goals' array.");
      }

      const sanitized = {
        version: parsed.version || '1.0.0',
        profile: { name: parsed.profile?.name || 'Scholar Student', email: parsed.profile?.email || 'local.scholar@device' },
        streak: { current_streak: parsed.streak?.current_streak || 0, longest_streak: parsed.streak?.longest_streak || 0, last_checkin_date: parsed.streak?.last_checkin_date || null },
        calendarHistory: parsed.calendarHistory || {},
        goals: parsed.goals || [],
        settings: { onboardingCompleted: true, theme: parsed.settings?.theme || 'dark' }
      };

      window.storageManager.saveStore(sanitized);
      return { success: true, store: sanitized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
