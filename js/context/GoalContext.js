/**
 * ============================================================================
 * GoalContext Provider (Phase 2 - Real Database State Management)
 * Fetches and syncs real user data from Supabase backend.
 * Zero hardcoded arrays or fake fallbacks.
 * ============================================================================
 */

const { createContext, useContext, useState, useEffect, useCallback } = React;

const GoalContext = createContext();

window.GoalProvider = function({ children }) {
  const { user } = window.useAuth();

  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, last_checkin_date: null });
  const [calendarHistory, setCalendarHistory] = useState({});
  const [profile, setProfile] = useState(null);
  
  const [dataLoading, setDataLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  // Load all user data whenever user logs in or mounts
  const refreshUserData = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setStreak({ current_streak: 0, longest_streak: 0, last_checkin_date: null });
      setCalendarHistory({});
      setProfile(null);
      return;
    }

    setDataLoading(true);
    setErrorBanner(null);

    try {
      // 1. Fetch Goals tree
      const goalsTree = await window.goalService.fetchUserGoals(user.id);
      setGoals(goalsTree);

      // 2. Fetch Fire Streak
      const streakData = await window.goalService.fetchStreak(user.id);
      setStreak(streakData);

      // 3. Fetch Calendar Check-ins for Current Month
      const today = new Date();
      const calMap = await window.goalService.fetchCalendarCheckIns(user.id, today.getFullYear(), today.getMonth());
      setCalendarHistory(calMap);

      // 4. Fetch User Profile
      const profData = await window.goalService.fetchUserProfile(user.id);
      setProfile(profData);
    } catch (err) {
      console.error("[GoalContext] Error loading user data:", err.message);
      setErrorBanner("Failed to sync data with Supabase: " + err.message);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshUserData();
  }, [user, refreshUserData]);

  // --- CRUD Operations for 3-Tier Hierarchy ---

  // 1. Goal CRUD
  const addGoal = async (title, category = 'General', color = '#6366f1') => {
    if (!user) return;
    setErrorBanner(null);
    try {
      const newGoal = await window.goalService.createGoal(user.id, title, category, color);
      setGoals(prev => [newGoal, ...prev]);
      setFeedbackBanner("🎯 Goal created successfully!");
      setTimeout(() => setFeedbackBanner(null), 3000);
    } catch (err) {
      setErrorBanner("Failed to create goal: " + err.message);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!user) return;
    setErrorBanner(null);
    try {
      await window.goalService.deleteGoal(goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      setFeedbackBanner("Goal deleted.");
      setTimeout(() => setFeedbackBanner(null), 3000);
    } catch (err) {
      setErrorBanner("Failed to delete goal: " + err.message);
    }
  };

  // 2. Task CRUD
  const addTask = async (goalId, taskTitle) => {
    if (!user) return;
    setErrorBanner(null);
    try {
      const newTask = await window.goalService.createTask(user.id, goalId, taskTitle);
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return { ...g, tasks: [...g.tasks, newTask] };
        }
        return g;
      }));
      setFeedbackBanner("📌 Task added.");
      setTimeout(() => setFeedbackBanner(null), 3000);
    } catch (err) {
      setErrorBanner("Failed to add task: " + err.message);
    }
  };

  const deleteTask = async (goalId, taskId) => {
    if (!user) return;
    setErrorBanner(null);
    try {
      await window.goalService.deleteTask(taskId);
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return { ...g, tasks: g.tasks.filter(t => t.id !== taskId) };
        }
        return g;
      }));
    } catch (err) {
      setErrorBanner("Failed to delete task: " + err.message);
    }
  };

  // 3. Subtask CRUD & Completion Toggling
  const addSubtask = async (goalId, taskId, subtaskTitle) => {
    if (!user) return;
    setErrorBanner(null);
    try {
      const newSubtask = await window.goalService.createSubtask(user.id, taskId, subtaskTitle);
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return {
            ...g,
            tasks: g.tasks.map(t => {
              if (t.id === taskId) {
                return { ...t, subtasks: [...t.subtasks, newSubtask] };
              }
              return t;
            })
          };
        }
        return g;
      }));
    } catch (err) {
      setErrorBanner("Failed to add subtask: " + err.message);
    }
  };

  const toggleSubtask = async (goalId, taskId, subtaskId, currentStatus) => {
    if (!user) return;
    setErrorBanner(null);
    const newStatus = !currentStatus;

    // Optimistic Update
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          tasks: g.tasks.map(t => {
            if (t.id === taskId) {
              const updatedSubtasks = t.subtasks.map(st => {
                if (st.id === subtaskId) {
                  return { ...st, completed: newStatus };
                }
                return st;
              });
              const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
              return { ...t, completed: allDone, subtasks: updatedSubtasks };
            }
            return t;
          })
        };
      }
      return g;
    }));

    try {
      await window.goalService.toggleSubtask(subtaskId, newStatus);
    } catch (err) {
      setErrorBanner("Failed to toggle subtask: " + err.message);
      refreshUserData(); // Revert on failure
    }
  };

  const deleteSubtask = async (goalId, taskId, subtaskId) => {
    if (!user) return;
    setErrorBanner(null);
    try {
      await window.goalService.deleteSubtask(subtaskId);
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return {
            ...g,
            tasks: g.tasks.map(t => {
              if (t.id === taskId) {
                return { ...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId) };
              }
              return t;
            })
          };
        }
        return g;
      }));
    } catch (err) {
      setErrorBanner("Failed to delete subtask: " + err.message);
    }
  };

  // --- Daily Check-in & Fire Streak Logic ---
  const triggerDailyCheckIn = async () => {
    if (!user) return;
    setErrorBanner(null);

    // Calculate completed subtasks count
    let completedCount = 0;
    goals.forEach(g => g.tasks.forEach(t => t.subtasks.forEach(st => {
      if (st.completed) completedCount++;
    })));

    try {
      const res = await window.goalService.recordDailyCheckIn(user.id, completedCount);

      if (res.alreadyCheckedIn) {
        setFeedbackBanner("⚡ " + res.message);
        setTimeout(() => setFeedbackBanner(null), 3500);
      } else {
        // Trigger Canvas Confetti Celebration!
        if (window.confetti) {
          window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
        setStreak(res.streak);
        const todayStr = new Date().toISOString().split('T')[0];
        setCalendarHistory(prev => ({ ...prev, [todayStr]: true }));
        setFeedbackBanner("🔥 " + res.message);
        setTimeout(() => setFeedbackBanner(null), 3500);
      }
    } catch (err) {
      setErrorBanner("Check-in failed: " + err.message);
    }
  };

  // --- Profile Updates ---
  const updateUserProfile = async (fullName) => {
    if (!user) return;
    setErrorBanner(null);
    try {
      const updated = await window.goalService.updateProfile(user.id, fullName);
      setProfile(updated);
      setFeedbackBanner("Profile name updated successfully!");
      setTimeout(() => setFeedbackBanner(null), 3000);
    } catch (err) {
      setErrorBanner("Failed to update profile: " + err.message);
    }
  };

  // --- Live Metrics Calculation from Database State ---
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
      currentStreak: streak.current_streak || 0,
      longestStreak: streak.longest_streak || 0
    };
  };

  const value = {
    goals,
    streak,
    calendarHistory,
    profile,
    dataLoading,
    errorBanner,
    feedbackBanner,
    refreshUserData,
    addGoal,
    deleteGoal,
    addTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    triggerDailyCheckIn,
    updateUserProfile,
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
