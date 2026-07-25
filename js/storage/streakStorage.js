/**
 * ============================================================================
 * Streak Storage Module (Redesigned Daily Check-in & Fire Streak Engine)
 * Handles explicit check-in verification, date math, and status queries.
 * ============================================================================
 */

window.streakStorage = {
  /**
   * Fetch current streak record
   */
  getStreak() {
    const store = window.storageManager.getStore();
    return store.streak || { current_streak: 0, longest_streak: 0, last_checkin_date: null };
  },

  /**
   * Check if today's date has already been checked in
   */
  isTodayCheckedIn() {
    const store = window.storageManager.getStore();
    const todayStr = new Date().toISOString().split('T')[0];
    const streak = store.streak || {};
    const calendarHistory = store.calendarHistory || {};

    return streak.last_checkin_date === todayStr || !!calendarHistory[todayStr];
  },

  /**
   * Execute Daily Check-in with strict validation
   */
  processCheckIn() {
    const store = window.storageManager.getStore();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Verify if already checked in today
    if (this.isTodayCheckedIn()) {
      return {
        success: false,
        info: "You've already checked in today.",
        streak: store.streak
      };
    }

    // 2. Gather all subtasks and verify completion
    const goals = store.goals || [];
    const subtasks = [];
    goals.forEach(g => {
      (g.tasks || []).forEach(t => {
        (t.subtasks || []).forEach(st => {
          subtasks.push(st);
        });
      });
    });

    if (subtasks.length === 0) {
      return {
        success: false,
        error: "No tasks scheduled for today."
      };
    }

    const allDone = subtasks.every(st => st.completed);
    if (!allDone) {
      return {
        success: false,
        error: "Finish all required tasks before checking in."
      };
    }

    // 3. Calculate Date Difference Math
    const currentStreakRecord = store.streak || { current_streak: 0, longest_streak: 0, last_checkin_date: null };
    let newCurrent = 1;
    const lastDateStr = currentStreakRecord.last_checkin_date;

    if (lastDateStr) {
      const todayDate = new Date(todayStr);
      const lastDate = new Date(lastDateStr);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newCurrent = (currentStreakRecord.current_streak || 0) + 1;
      } else {
        newCurrent = 1; // Streak resets if day missed
      }
    } else {
      newCurrent = 1;
    }

    const newLongest = Math.max(newCurrent, currentStreakRecord.longest_streak || 0);

    const updatedStreak = {
      current_streak: newCurrent,
      longest_streak: newLongest,
      last_checkin_date: todayStr
    };

    store.streak = updatedStreak;
    store.calendarHistory = {
      ...(store.calendarHistory || {}),
      [todayStr]: true
    };

    window.storageManager.saveStore(store);

    return {
      success: true,
      message: "Check-in Recorded! 🔥 Streak: " + newCurrent + " Days!",
      streak: updatedStreak
    };
  }
};
