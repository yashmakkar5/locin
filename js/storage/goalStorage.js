/**
 * ============================================================================
 * Goal Storage Module (Goal Level 1 CRUD Operations)
 * Provides both window.goalStorage and window.goalService interfaces.
 * ============================================================================
 */

window.goalStorage = {
  /**
   * Fetch all goals
   */
  getGoals() {
    const store = window.storageManager.getStore();
    return store.goals || [];
  },

  /**
   * Create a new Goal
   */
  addGoal(title, category = 'General', color = '#6366f1') {
    const store = window.storageManager.getStore();
    const newGoal = {
      id: window.storageManager.generateUUID(),
      title: title.trim(),
      category: category.trim(),
      color,
      created_at: new Date().toISOString(),
      tasks: []
    };

    const updatedGoals = [newGoal, ...store.goals];
    store.goals = updatedGoals;
    window.storageManager.saveStore(store);
    return newGoal;
  },

  createGoal(title, category = 'General', color = '#6366f1') {
    return this.addGoal(title, category, color);
  },

  /**
   * Delete a Goal by ID
   */
  deleteGoal(goalId) {
    const store = window.storageManager.getStore();
    store.goals = store.goals.filter(g => g.id !== goalId);
    window.storageManager.saveStore(store);
    return store.goals;
  }
};

// Service Alias
window.goalService = window.goalStorage;
