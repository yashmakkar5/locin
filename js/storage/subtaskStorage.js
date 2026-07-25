/**
 * ============================================================================
 * Subtask Storage Module (Subtask Level 3 CRUD & Completion Controls)
 * Supports completedAt timestamps, subtask completion toggles, and cascade detection.
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
      completedAt: null,
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
    let allSubtasksDone = false;
    let targetTask = null;

    store.goals = store.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: (goal.tasks || []).map(task => {
            if (task.id === taskId) {
              const updatedSubtasks = (task.subtasks || []).map(st => {
                if (st.id === subtaskId) {
                  const nextState = !st.completed;
                  return {
                    ...st,
                    completed: nextState,
                    completedAt: nextState ? new Date().toISOString() : null
                  };
                }
                return st;
              });

              allSubtasksDone = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
              targetTask = task;

              return {
                ...task,
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

    return {
      allSubtasksDone,
      task: targetTask
    };
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
