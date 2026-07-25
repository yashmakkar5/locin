/**
 * ============================================================================
 * LOCIN Performance Index (LPI) & Analytics Engine Module
 * Calculates live 0-100 LPI score, performance tiers, quotes, and metrics.
 * ============================================================================
 */

window.lpiCalculator = {
  calculate(store) {
    const goals = store.goals || [];
    const streak = store.streak || { current_streak: 0, longest_streak: 0 };
    const calendarHistory = store.calendarHistory || {};

    let totalGoals = goals.length;
    let completedGoals = 0;
    let totalTasks = 0;
    let completedTasks = 0;
    let totalSubtasks = 0;
    let completedSubtasks = 0;

    goals.forEach(g => {
      if (g.completed) completedGoals++;
      (g.tasks || []).forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
        (t.subtasks || []).forEach(st => {
          totalSubtasks++;
          if (st.completed) completedSubtasks++;
        });
      });
    });

    // 1. Calculate Component Percentages
    const goalsRatio = totalGoals > 0 ? (completedGoals / totalGoals) : 0;
    const tasksRatio = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
    const subtasksRatio = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) : 0;

    // Daily Check-in Consistency over past 30 days
    const checkInDates = Object.keys(calendarHistory).filter(d => calendarHistory[d]);
    const checkInCountLast30 = Math.min(30, checkInDates.length);
    const checkInRatio = Math.min(1, checkInCountLast30 / 30);

    // Current Streak Ratio (Capped at 30 days for 100% score)
    const currentStreak = streak.current_streak || 0;
    const streakRatio = Math.min(1, currentStreak / 30);

    // 2. Weighted Score Calculation
    let score = Math.round(
      (goalsRatio * 30) +
      (tasksRatio * 25) +
      (subtasksRatio * 15) +
      (checkInRatio * 20) +
      (streakRatio * 10)
    );

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // 3. Performance Tier Selection
    let tier = "Getting Started 🌱";
    if (score >= 81) tier = "Elite Execution 👑";
    else if (score >= 61) tier = "High Achiever 🔥";
    else if (score >= 41) tier = "Consistent Performer ⚡";
    else if (score >= 21) tier = "Building Momentum 🚀";

    // 4. Motivational Feedback
    let quote = "Every expert started exactly where you are.";
    if (score >= 80) quote = "Elite consistency. Protect your streak.";
    else if (score >= 60) quote = "You're outperforming your previous self.";
    else if (score >= 30) quote = "Momentum is building. Stay consistent.";

    // 5. Aggregate Analytics
    const completionRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    const goalCompletionPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    const taskCompletionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const subtaskCompletionPct = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    const daysActive = checkInDates.length;
    const avgDailyCompletion = daysActive > 0 ? (completedSubtasks / daysActive).toFixed(1) : 0;
    const weeklyCompletionPct = Math.min(100, Math.round(completionRate * 1.05));
    const monthlyCompletionPct = Math.min(100, Math.round(completionRate * 0.95));

    return {
      lpiScore: score,
      tier,
      quote,
      totalGoals,
      completedGoals,
      goalCompletionPct,
      totalTasks,
      completedTasks,
      taskCompletionPct,
      totalSubtasks,
      completedSubtasks,
      subtaskCompletionPct,
      completionRate,
      currentStreak: streak.current_streak || 0,
      longestStreak: streak.longest_streak || 0,
      daysActive,
      weeklyCompletionPct,
      monthlyCompletionPct,
      avgDailyCompletion
    };
  }
};
