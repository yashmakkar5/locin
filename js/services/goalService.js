/**
 * ============================================================================
 * Goal Management & Database Service Module (Phase 2 - Real Supabase DB)
 * Handles CRUD for 3-Tier Hierarchy (goals -> tasks -> subtasks),
 * Fire Streak Date Math, Daily Check-ins, Calendar Queries, and Profile Syncing.
 * ============================================================================
 */

window.goalService = {
  /**
   * Fetch 3-tier hierarchy: Goals -> Tasks -> Subtasks for authenticated user
   */
  async fetchUserGoals(userId) {
    const client = window.getSupabaseClient();
    
    // Fetch goals
    const { data: goals, error: goalsError } = await client
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (goalsError) throw goalsError;
    if (!goals || goals.length === 0) return [];

    const goalIds = goals.map(g => g.id);

    // Fetch tasks for user's goals
    const { data: tasks, error: tasksError } = await client
      .from('tasks')
      .select('*')
      .in('goal_id', goalIds)
      .order('created_at', { ascending: true });

    if (tasksError) throw tasksError;

    const taskIds = (tasks || []).map(t => t.id);

    // Fetch subtasks for user's tasks
    let subtasks = [];
    if (taskIds.length > 0) {
      const { data: subtasksData, error: subtasksError } = await client
        .from('subtasks')
        .select('*')
        .in('task_id', taskIds)
        .order('created_at', { ascending: true });

      if (subtasksError) throw subtasksError;
      subtasks = subtasksData || [];
    }

    // Assemble 3-Tier Tree Structure
    const structuredGoals = goals.map(goal => {
      const goalTasks = (tasks || [])
        .filter(t => t.goal_id === goal.id)
        .map(task => {
          const taskSubtasks = subtasks.filter(st => st.task_id === task.id);
          const allDone = taskSubtasks.length > 0 && taskSubtasks.every(st => st.completed);
          return {
            ...task,
            completed: allDone,
            subtasks: taskSubtasks
          };
        });

      return {
        ...goal,
        tasks: goalTasks
      };
    });

    return structuredGoals;
  },

  /**
   * Create a new Goal (Level 1)
   */
  async createGoal(userId, title, category = 'General', color = '#6366f1') {
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('goals')
      .insert({
        user_id: userId,
        title,
        category,
        color
      })
      .select()
      .single();

    if (error) throw error;
    return { ...data, tasks: [] };
  },

  /**
   * Delete a Goal (Cascade deletes nested tasks & subtasks via foreign key)
   */
  async deleteGoal(goalId) {
    const client = window.getSupabaseClient();
    const { error } = await client
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;
  },

  /**
   * Create a new Task (Level 2)
   */
  async createTask(userId, goalId, title) {
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('tasks')
      .insert({
        user_id: userId,
        goal_id: goalId,
        title,
        completed: false
      })
      .select()
      .single();

    if (error) throw error;
    return { ...data, subtasks: [] };
  },

  /**
   * Delete a Task
   */
  async deleteTask(taskId) {
    const client = window.getSupabaseClient();
    const { error } = await client
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  },

  /**
   * Create a new Subtask (Level 3)
   */
  async createSubtask(userId, taskId, title) {
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('subtasks')
      .insert({
        user_id: userId,
        task_id: taskId,
        title,
        completed: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Toggle Subtask Completion Status
   */
  async toggleSubtask(subtaskId, completed) {
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('subtasks')
      .update({ completed })
      .eq('id', subtaskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a Subtask
   */
  async deleteSubtask(subtaskId) {
    const client = window.getSupabaseClient();
    const { error } = await client
      .from('subtasks')
      .delete()
      .eq('id', subtaskId);

    if (error) throw error;
  },

  /**
   * Fetch User Streak Record from `streaks` table
   */
  async fetchStreak(userId) {
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) console.error("[goalService] fetchStreak error:", error.message);
    
    if (!data) {
      // Create record if missing
      const { data: newStreak } = await client
        .from('streaks')
        .insert({ user_id: userId, current_streak: 0, longest_streak: 0, last_checkin_date: null })
        .select()
        .single();
      return newStreak || { current_streak: 0, longest_streak: 0, last_checkin_date: null };
    }
    return data;
  },

  /**
   * Record Daily Check-in & Calculate Fire Streak
   * Strictly enforces 1 check-in per calendar day using exact date comparison (YYYY-MM-DD).
   */
  async recordDailyCheckIn(userId, completedSubtasksCount = 0) {
    const client = window.getSupabaseClient();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Check if user has ALREADY checked in today in `daily_checkins`
    const { data: existingCheckIn } = await client
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', todayStr)
      .maybeSingle();

    const streakRecord = await this.fetchStreak(userId);

    if (existingCheckIn) {
      return { 
        alreadyCheckedIn: true, 
        message: "You have already completed today's check-in! 🔥", 
        streak: streakRecord 
      };
    }

    // 2. Calculate Date Math for Fire Streak
    let newCurrentStreak = 1;
    const lastDateStr = streakRecord.last_checkin_date;

    if (lastDateStr) {
      const todayDate = new Date(todayStr);
      const lastDate = new Date(lastDateStr);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive Day Check-in! Increment Streak
        newCurrentStreak = (streakRecord.current_streak || 0) + 1;
      } else if (diffDays === 0) {
        newCurrentStreak = streakRecord.current_streak || 1;
      } else {
        // Missed one or more days -> Streak Resets to 1
        newCurrentStreak = 1;
      }
    } else {
      // First check-in ever
      newCurrentStreak = 1;
    }

    const newLongestStreak = Math.max(newCurrentStreak, streakRecord.longest_streak || 0);

    // 3. Record Check-in in `daily_checkins` table
    const { error: checkInError } = await client
      .from('daily_checkins')
      .insert({
        user_id: userId,
        checkin_date: todayStr,
        subtasks_completed_count: completedSubtasksCount
      });

    if (checkInError) throw checkInError;

    // 4. Update `streaks` table
    const { data: updatedStreak, error: streakUpdateError } = await client
      .from('streaks')
      .upsert({
        user_id: userId,
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_checkin_date: todayStr,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (streakUpdateError) throw streakUpdateError;

    return { 
      alreadyCheckedIn: false, 
      message: "Daily Check-in Recorded! 🔥", 
      streak: updatedStreak 
    };
  },

  /**
   * Fetch Check-in dates for Calendar view for a specific month
   */
  async fetchCalendarCheckIns(userId, year, month) {
    const client = window.getSupabaseClient();
    
    // Start & End of target month
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayNum = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`;

    const { data, error } = await client
      .from('daily_checkins')
      .select('checkin_date, subtasks_completed_count')
      .eq('user_id', userId)
      .gte('checkin_date', startDate)
      .lte('checkin_date', endDate);

    if (error) throw error;

    const checkInMap = {};
    (data || []).forEach(row => {
      checkInMap[row.checkin_date] = true;
    });

    return checkInMap;
  },

  /**
   * Update Profile Name in `profiles` table
   */
  async updateProfile(userId, fullName) {
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch User Profile Record
   */
  async fetchUserProfile(userId) {
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) console.error("[goalService] fetchUserProfile error:", error.message);
    return data;
  }
};
