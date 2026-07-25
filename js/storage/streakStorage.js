/**
 * ============================================================================
 * Streak Storage Module (Daily Check-in Validation & Fire Streak Math)
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
   * Execute Daily Check-in with Task Completion Verification
   */
  processCheckIn() {
    const store = window.storageManager.getStore();
    const goals = store.goals || [];

    // Gather all subtasks
    const subtasks = [];
    goals.forEach(g => {
      (g.tasks || []).forEach(t => {
        (t.subtasks || []).forEach(st => {
          subtasks.push(st);
        });
      });
    });

    // 1. Verify if user has subtasks and if ALL subtasks are completed
    if (subtasks.length > 0) {
      const allDone = subtasks.every(st => st.completed);
      if (!allDone) {
        return {
          success: false,
          error: "Complete all today's tasks before checking in."
        };
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const currentStreak = store.streak || { current_streak: 0, longest_streak: 0, last_checkin_date: null };

    // 2. Check if user already checked in today
    if (currentStreak.last_checkin_date === todayStr) {
      return {
        success: false,
        info: "You have already completed today's check-in! 🔥",
        streak: currentStreak
      };
    }

    // 3. Calculate Date Difference Math
    let newCurrent = 1;
    const lastDateStr = currentStreak.last_checkin_date;

    if (lastDateStr) {
      const todayDate = new Date(todayStr);
      const lastDate = new Date(lastDateStr);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newCurrent = (currentStreak.current_streak || 0) + 1;
      } else {
        newCurrent = 1; // Missed day resets streak
      }
    } else {
      newCurrent = 1;
    }

    const newLongest = Math.max(newCurrent, currentStreak.longest_streak || 0);

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
      message: "Daily Check-in Recorded! 🔥 Streak: " + newCurrent + " Days!",
      streak: updatedStreak
    };
  }
};
