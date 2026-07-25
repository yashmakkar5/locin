/**
 * ============================================================================
 * Task Storage Module (Task Level 2 CRUD & Completion Controls)
 * Supports completedAt timestamps, task completion toggles, and in-progress actions.
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
      completedAt: null,
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
   * Mark Task Complete
   */
  markTaskComplete(goalId, taskId) {
    const store = window.storageManager.getStore();

    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: (goal.tasks || []).map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: true,
                completedAt: new Date().toISOString()
              };
            }
            return task;
          })
        };
      }
      return goal;
    });

    window.storageManager.saveStore(store);
  },

  /**
   * Mark Task In Progress
   */
  markTaskInProgress(goalId, taskId) {
    const store = window.storageManager.getStore();

    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: (goal.tasks || []).map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: false,
                completedAt: null
              };
            }
            return task;
          })
        };
      }
      return goal;
    });

    window.storageManager.saveStore(store);
  },

  /**
   * Delete a Task
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
