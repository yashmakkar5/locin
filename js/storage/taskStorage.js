/**
 * ============================================================================
 * Task Storage Module (Task Level 2 CRUD Operations)
 * ============================================================================
 */

window.taskStorage = {
  /**
   * Add a Task under a Goal
   */
  addTask(goalId, title) {
    const store = window.storageManager.getStore();
    const newTask = {
      id: window.storageManager.generateUUID(),
      goal_id: goalId,
      title: title.trim(),
      completed: false,
      created_at: new Date().toISOString(),
      subtasks: []
    };

    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: [...(goal.tasks || []), newTask]
        };
      }
      return goal;
    });

    window.storageManager.saveStore(store);
    return newTask;
  },

  /**
   * Delete a Task by Goal ID and Task ID
   */
  deleteTask(goalId, taskId) {
    const store = window.storageManager.getStore();
    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: (goal.tasks || []).filter(t => t.id !== taskId)
        };
      }
      return goal;
    });

    window.storageManager.saveStore(store);
  }
};
