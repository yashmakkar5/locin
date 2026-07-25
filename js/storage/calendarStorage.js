/**
 * ============================================================================
 * Calendar Storage Module (Check-in Dates History & Monthly Queries)
 * ============================================================================
 */

window.calendarStorage = {
  /**
   * Fetch all calendar check-in dates
   */
  getCalendarHistory() {
    const store = window.storageManager.getStore();
    return store.calendarHistory || {};
  },

  /**
   * Fetch check-ins for a specific year & month
   */
  getMonthlyCheckIns(year, month) {
    const history = this.getCalendarHistory();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthlyMap = {};

    Object.keys(history).forEach(dateStr => {
      if (dateStr.startsWith(monthPrefix) && history[dateStr]) {
        monthlyMap[dateStr] = true;
      }
    });

    return monthlyMap;
  }
};
