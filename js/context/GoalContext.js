/**
 * ============================================================================
 * GoalContext Provider
 * Global Reactive State for Goals -> Tasks -> Subtasks hierarchy,
 * Daily Check-in celebrations, Fire Streak system, and Calendar heatmap.
 * ============================================================================
 */

const { createContext, useContext, useState, useEffect } = React;

const GoalContext = createContext();

// Sample initial data matching prompt requirements
const INITIAL_DEMO_GOALS = [
  {
    id: 'g-1',
    title: 'Learn AI',
    category: 'Technology',
    color: '#6366f1',
    created_at: new Date().toISOString(),
    tasks: [
      {
        id: 't-101',
        title: 'Python Basics',
        completed: false,
        subtasks: [
          { id: 'st-1001', title: 'Variables & Data Types', completed: true },
          { id: 'st-1002', title: 'Loops & Conditionals', completed: true },
          { id: 'st-1003', title: 'Functions & Modules', completed: false }
        ]
      },
      {
        id: 't-102',
        title: 'Machine Learning',
        completed: false,
        subtasks: [
          { id: 'st-1004', title: 'Linear & Logistic Regression', completed: false },
          { id: 'st-1005', title: 'Classification Algorithms', completed: false }
        ]
      }
    ]
  },
  {
    id: 'g-2',
    title: 'Peak Physical Fitness',
    category: 'Health',
    color: '#ec4899',
    created_at: new Date().toISOString(),
    tasks: [
      {
        id: 't-201',
        title: 'Daily Fitness Protocol',
        completed: true,
        subtasks: [
          { id: 'st-2001', title: '30 Mins Morning Run', completed: true },
          { id: 'st-2002', title: 'Hydrate 3 Liters Water', completed: true },
          { id: 'st-2003', title: 'Post-Workout Stretching', completed: true }
        ]
      }
    ]
  }
];

window.GoalProvider = function({ children }) {
  const { user } = window.useAuth();

  // Goals State
  const [goals, setGoals] = useState([]);
  
  // Streak State
  const [streak, setStreak] = useState({
    current: 7,
    longest: 14,
    lastCheckInDate: new Date().toISOString().split('T')[0]
  });

  // Calendar Check-in History (Map of YYYY-MM-DD -> status)
  const [calendarHistory, setCalendarHistory] = useState(() => {
    const today = new Date();
    const history = {};
    // Pre-fill last 7 days for realistic heatmap demonstration
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      history[dateStr] = true;
    }
    return history;
  });

  // Load Goals on mount or user change
  useEffect(() => {
    const userId = user ? user.id : 'demo';
    const storedGoals = localStorage.getItem(`locin_goals_${userId}`);
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      setGoals(INITIAL_DEMO_GOALS);
      localStorage.setItem(`locin_goals_${userId}`, JSON.stringify(INITIAL_DEMO_GOALS));
    }

    const storedStreak = localStorage.getItem(`locin_streak_${userId}`);
    if (storedStreak) {
      setStreak(JSON.parse(storedStreak));
    }
  }, [user]);

  // Persist Goals whenever state updates
  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    const userId = user ? user.id : 'demo';
    window.goalService.syncGoals(userId, updatedGoals);
  };

  // --- CRUD Operations for 3-Tier Hierarchy ---

  // 1. Goal CRUD
  const addGoal = (title, category = 'General', color = '#6366f1') => {
    const newGoal = {
      id: 'g-' + Date.now(),
      title,
      category,
      color,
      created_at: new Date().toISOString(),
      tasks: []
    };
    const updated = [newGoal, ...goals];
    saveGoals(updated);
  };

  const deleteGoal = (goalId) => {
    const updated = goals.filter(g => g.id !== goalId);
    saveGoals(updated);
  };

  // 2. Task CRUD
  const addTask = (goalId, taskTitle) => {
    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: [
            ...goal.tasks,
            {
              id: 't-' + Date.now(),
              title: taskTitle,
              completed: false,
              subtasks: []
            }
          ]
        };
      }
      return goal;
    });
    saveGoals(updated);
  };

  const deleteTask = (goalId, taskId) => {
    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.filter(t => t.id !== taskId)
        };
      }
      return goal;
    });
    saveGoals(updated);
  };

  // 3. Subtask CRUD & Completion Toggling
  const addSubtask = (goalId, taskId, subtaskTitle) => {
    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: [
                  ...task.subtasks,
                  {
                    id: 'st-' + Date.now(),
                    title: subtaskTitle,
                    completed: false
                  }
                ]
              };
            }
            return task;
          })
        };
      }
      return goal;
    });
    saveGoals(updated);
  };

  const toggleSubtask = (goalId, taskId, subtaskId) => {
    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map(task => {
            if (task.id === taskId) {
              const newSubtasks = task.subtasks.map(st => {
                if (st.id === subtaskId) {
                  return { ...st, completed: !st.completed };
                }
                return st;
              });
              // Check if all subtasks are complete
              const allSubtasksDone = newSubtasks.every(st => st.completed);
              return {
                ...task,
                completed: allSubtasksDone,
                subtasks: newSubtasks
              };
            }
            return task;
          })
        };
      }
      return goal;
    });
    saveGoals(updated);
  };

  const deleteSubtask = (goalId, taskId, subtaskId) => {
    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: task.subtasks.filter(st => st.id !== subtaskId)
              };
            }
            return task;
          })
        };
      }
      return goal;
    });
    saveGoals(updated);
  };

  // --- Daily Check-in & Fire Streak Logic ---
  const triggerDailyCheckIn = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Trigger Canvas Confetti Celebration!
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Update Streak Count
    const newCurrent = streak.current + 1;
    const newLongest = Math.max(newCurrent, streak.longest);
    const updatedStreak = {
      current: newCurrent,
      longest: newLongest,
      lastCheckInDate: todayStr
    };

    setStreak(updatedStreak);
    const userId = user ? user.id : 'demo';
    localStorage.setItem(`locin_streak_${userId}`, JSON.stringify(updatedStreak));

    // Update Calendar History
    setCalendarHistory(prev => ({ ...prev, [todayStr]: true }));

    // Sync with Supabase if configured
    window.goalService.recordCheckIn(userId, updatedStreak);
  };

  // --- Global Progress & Stats Calculations ---
  const getStats = () => {
    let totalGoals = goals.length;
    let totalTasks = 0;
    let completedTasks = 0;
    let totalSubtasks = 0;
    let completedSubtasks = 0;

    goals.forEach(g => {
      g.tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
        t.subtasks.forEach(st => {
          totalSubtasks++;
          if (st.completed) completedSubtasks++;
        });
      });
    });

    const completionPercentage = totalSubtasks > 0 
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

    return {
      totalGoals,
      totalTasks,
      completedTasks,
      totalSubtasks,
      completedSubtasks,
      completionPercentage,
      currentStreak: streak.current,
      longestStreak: streak.longest
    };
  };

  const value = {
    goals,
    streak,
    calendarHistory,
    addGoal,
    deleteGoal,
    addTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    triggerDailyCheckIn,
    getStats
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};

window.useGoals = function() {
  return useContext(GoalContext);
};
