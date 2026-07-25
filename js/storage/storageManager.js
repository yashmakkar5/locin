/**
 * ============================================================================
 * Storage Manager Module (Core Storage Coordinator & UUID Generator)
 * ============================================================================
 */

const STORE_KEY = 'locin_v1_store';

// Clean initial store with ZERO hardcoded demo goals
const EMPTY_STORE = {
  version: '1.0.0',
  profile: {
    name: 'Scholar Student',
    email: 'local.scholar@device',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  },
  streak: {
    current_streak: 0,
    longest_streak: 0,
    last_checkin_date: null
  },
  calendarHistory: {},
  goals: [], // 100% EMPTY ON FIRST LAUNCH
  settings: {
    onboardingCompleted: false,
    theme: 'dark'
  }
};

window.storageManager = {
  /**
   * Generate a unique ID using crypto.randomUUID()
   */
  generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  },

  /**
   * Read raw store from LocalStorage
   */
  getStore() {
    try {
      const item = localStorage.getItem(STORE_KEY);
      if (!item) {
        this.saveStore(EMPTY_STORE);
        return EMPTY_STORE;
      }
      const parsed = JSON.parse(item);

      // Verify goals array exists and is valid
      return {
        version: parsed.version || '1.0.0',
        profile: { ...EMPTY_STORE.profile, ...(parsed.profile || {}) },
        streak: { ...EMPTY_STORE.streak, ...(parsed.streak || {}) },
        calendarHistory: parsed.calendarHistory || {},
        goals: Array.isArray(parsed.goals) ? parsed.goals : [],
        settings: { ...EMPTY_STORE.settings, ...(parsed.settings || {}) }
      };
    } catch (err) {
      console.error("[Storage Manager] Error reading store:", err);
      return EMPTY_STORE;
    }
  },

  /**
   * Save store to LocalStorage
   */
  saveStore(store) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (err) {
      console.error("[Storage Manager] Error writing store:", err);
    }
  },

  /**
   * Clear all stored data
   */
  clearStore() {
    localStorage.removeItem(STORE_KEY);
    this.saveStore(EMPTY_STORE);
    return EMPTY_STORE;
  }
};
