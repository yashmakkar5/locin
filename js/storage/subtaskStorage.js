/**
 * ============================================================================
 * Subtask Storage Module (Subtask Level 3 CRUD & Checkbox Persistence)
 * ============================================================================
 */

window.subtaskStorage = {
  /**
   * Add a Subtask under a Task
   */
  addSubtask(goalId, taskId, title) {
    const store = window.storageManager.getStore();
    const newSubtask = {
      id: window.storageManager.generateUUID(),
      task_id: taskId,
      title: title.trim(),
      completed: false,
      created_at: new Date().toISOString()
    };

    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: (goal.tasks || []).map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), newSubtask]
              };
            }
            return task;
          })
        };
      }
      return goal;
    });

    window.storageManager.saveStore(store);
    return newSubtask;
  },

  /**
   * Toggle Subtask completion checkbox status
   */
  toggleSubtask(goalId, taskId, subtaskId) {
    const store = window.storageManager.getStore();

    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: (goal.tasks || []).map(task => {
            if (task.id === taskId) {
              const updatedSubtasks = (task.subtasks || []).map(st => {
                if (st.id === subtaskId) {
                  return { ...st, completed: !st.completed };
                }
                return st;
              });
              const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
              return {
                ...task,
                completed: allDone,
                subtasks: updatedSubtasks
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
   * Delete a Subtask
   */
  deleteSubtask(goalId, taskId, subtaskId) {
    const store = window.storageManager.getStore();

    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: (goal.tasks || []).map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: (task.subtasks || []).filter(st => st.id !== subtaskId)
              };
            }
            return task;
          })
        };
      }
      return goal;
    });

    window.storageManager.saveStore(store);
  }
};
