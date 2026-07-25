/**
 * ============================================================================
 * Goal Storage Module (Goal Level 1 CRUD & Completion Controls)
 * Supports completedAt timestamps, goal completion toggles, and reopen actions.
 * ============================================================================
 */

window.goalStorage = {
  /**
   * Fetch active or completed goals
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
      completed: false,
      completedAt: null,
      created_at: new Date().toISOString(),
      tasks: []
    };

    store.goals = [newGoal, ...store.goals];
    window.storageManager.saveStore(store);
    return newGoal;
  },

  createGoal(title, category = 'General', color = '#6366f1') {
    return this.addGoal(title, category, color);
  },

  /**
   * Mark a Goal as Complete
   */
  markGoalComplete(goalId) {
    const store = window.storageManager.getStore();
    let completedGoalItem = null;

    store.goals = store.goals.map(g => {
      if (g.id === goalId) {
        completedGoalItem = {
          ...g,
          completed: true,
          completedAt: new Date().toISOString()
        };
        return completedGoalItem;
      }
      return g;
    });

    window.storageManager.saveStore(store);
    return completedGoalItem;
  },

  /**
   * Mark a Goal as In Progress / Reopen
   */
  reopenGoal(goalId) {
    const store = window.storageManager.getStore();

    store.goals = store.goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          completed: false,
          completedAt: null
        };
      }
      return g;
    });

    window.storageManager.saveStore(store);
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

window.goalService = window.goalStorage;
