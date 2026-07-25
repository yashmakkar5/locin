/**
 * ============================================================================
 * Storage Service Module (Privacy-First, Local-First Persistence Engine)
 * Manages LocalStorage persistence, JSON Backup Export/Import, and Data Reset.
 * ============================================================================
 */

const STORAGE_KEY = 'locin_app_data_v1';

// Initial default state for first-time users
const DEFAULT_APP_DATA = {
  version: '1.0.0',
  profile: {
    name: 'Scholar Student',
    email: 'local.scholar@device',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  },
  streak: {
    current_streak: 7,
    longest_streak: 14,
    last_checkin_date: new Date().toISOString().split('T')[0]
  },
  calendarHistory: (function() {
    const history = {};
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      history[d.toISOString().split('T')[0]] = true;
    }
    return history;
  })(),
  goals: [
    {
      id: 'g-1',
      title: 'Learn AI & Machine Learning',
      category: 'Technology',
      color: '#6366f1',
      created_at: new Date().toISOString(),
      tasks: [
        {
          id: 't-101',
          title: 'Python Basics',
          completed: false,
          subtasks: [
            { id: 'st-1001', title: 'Variables & Data Types', completed: true },
            { id: 'st-1002', title: 'Loops & Conditionals', completed: true },
            { id: 'st-1003', title: 'Functions & Modules', completed: false }
          ]
        },
        {
          id: 't-102',
          title: 'Machine Learning Fundamentals',
          completed: false,
          subtasks: [
            { id: 'st-1004', title: 'Linear & Logistic Regression', completed: false },
            { id: 'st-1005', title: 'Classification Algorithms', completed: false }
          ]
        }
      ]
    },
    {
      id: 'g-2',
      title: 'Peak Physical Fitness',
      category: 'Health',
      color: '#ec4899',
      created_at: new Date().toISOString(),
      tasks: [
        {
          id: 't-201',
          title: 'Daily Fitness Protocol',
          completed: true,
          subtasks: [
            { id: 'st-2001', title: '30 Mins Morning Workout', completed: true },
            { id: 'st-2002', title: 'Hydrate 3 Liters Water', completed: true },
            { id: 'st-2003', title: 'Post-Workout Stretching', completed: true }
          ]
        }
      ]
    }
  ],
  settings: {
    onboardingCompleted: false,
    theme: 'dark'
  }
};

window.storageService = {
  /**
   * Load Application Data from LocalStorage with error resilience
   */
  loadData() {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (!item) {
        this.saveData(DEFAULT_APP_DATA);
        return DEFAULT_APP_DATA;
      }
      const parsed = JSON.parse(item);
      // Fallback verification for missing object fields
      return {
        ...DEFAULT_APP_DATA,
        ...parsed,
        profile: { ...DEFAULT_APP_DATA.profile, ...(parsed.profile || {}) },
        streak: { ...DEFAULT_APP_DATA.streak, ...(parsed.streak || {}) },
        calendarHistory: parsed.calendarHistory || DEFAULT_APP_DATA.calendarHistory,
        goals: parsed.goals || DEFAULT_APP_DATA.goals,
        settings: { ...DEFAULT_APP_DATA.settings, ...(parsed.settings || {}) }
      };
    } catch (err) {
      console.error("[Storage Engine] Error parsing local storage data:", err);
      return DEFAULT_APP_DATA;
    }
  },

  /**
   * Save Application Data to LocalStorage
   */
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("[Storage Engine] Save failed:", err);
    }
  },

  /**
   * Export all data as a downloadable JSON file
   */
  exportBackup() {
    const data = this.loadData();
    const todayStr = new Date().toISOString().split('T')[0];
    const filename = `locin-backup-${todayStr}.json`;
    
    const jsonStr = JSON.stringify(data, null, 2);
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
   * Import data from JSON file with validation
   */
  importBackup(fileContent) {
    try {
      const parsed = JSON.parse(fileContent);

      // Validate required JSON structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error("Invalid file format. File is not a valid JSON object.");
      }

      if (!parsed.goals || !Array.isArray(parsed.goals)) {
        throw new Error("Invalid backup file: Missing 'goals' array.");
      }

      const sanitizedData = {
        version: parsed.version || '1.0.0',
        profile: {
          name: parsed.profile?.name || 'Scholar Student',
          email: parsed.profile?.email || 'local.scholar@device',
          joinedDate: parsed.profile?.joinedDate || new Date().toLocaleDateString()
        },
        streak: {
          current_streak: parsed.streak?.current_streak || 0,
          longest_streak: parsed.streak?.longest_streak || 0,
          last_checkin_date: parsed.streak?.last_checkin_date || null
        },
        calendarHistory: parsed.calendarHistory || {},
        goals: parsed.goals || [],
        settings: {
          onboardingCompleted: true,
          theme: parsed.settings?.theme || 'dark'
        }
      };

      this.saveData(sanitizedData);
      return { success: true, data: sanitizedData };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Reset all data to clean default first launch state
   */
  resetData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.saveData({
        ...DEFAULT_APP_DATA,
        settings: { onboardingCompleted: false, theme: 'dark' }
      });
      return DEFAULT_APP_DATA;
    } catch (err) {
      console.error("[Storage Engine] Reset failed:", err);
      return DEFAULT_APP_DATA;
    }
  }
};
