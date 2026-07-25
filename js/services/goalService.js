/**
 * ============================================================================
 * Goal Management & Database Service Module (Phase 3 Audit & Debug Logging)
 * Query Layer for goals, tasks, subtasks, streaks, daily check-ins, and profiles.
 * ============================================================================
 */

window.goalService = {
  /**
   * Fetch 3-tier hierarchy: Goals -> Tasks -> Subtasks for authenticated user
   */
  async fetchUserGoals(userId) {
    console.log("[DB Debug] Fetching goals hierarchy for user:", userId);
    const client = window.getSupabaseClient();
    
    // 1. Fetch goals
    const { data: goals, error: goalsError } = await client
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (goalsError) {
      console.error("[DB Debug] ❌ Error fetching goals:", goalsError.message);
      throw goalsError;
    }
    if (!goals || goals.length === 0) {
      console.log("[DB Debug] Zero goals found in DB.");
      return [];
    }

    const goalIds = goals.map(g => g.id);

    // 2. Fetch tasks for user's goals
    const { data: tasks, error: tasksError } = await client
      .from('tasks')
      .select('*')
      .in('goal_id', goalIds)
      .order('created_at', { ascending: true });

    if (tasksError) {
      console.error("[DB Debug] ❌ Error fetching tasks:", tasksError.message);
      throw tasksError;
    }

    const taskIds = (tasks || []).map(t => t.id);

    // 3. Fetch subtasks for user's tasks
    let subtasks = [];
    if (taskIds.length > 0) {
      const { data: subtasksData, error: subtasksError } = await client
        .from('subtasks')
        .select('*')
        .in('task_id', taskIds)
        .order('created_at', { ascending: true });

      if (subtasksError) {
        console.error("[DB Debug] ❌ Error fetching subtasks:", subtasksError.message);
        throw subtasksError;
      }
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

    console.log("[DB Debug] ✅ Goals hierarchy loaded successfully. Total goals:", structuredGoals.length);
    return structuredGoals;
  },

  /**
   * Create a new Goal (Level 1)
   */
  async createGoal(userId, title, category = 'General', color = '#6366f1') {
    console.log("[DB Debug] Creating goal:", title);
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

    if (error) {
      console.error("[DB Debug] ❌ Create goal error:", error.message);
      throw error;
    }
    console.log("[DB Debug] ✅ Goal created with ID:", data.id);
    return { ...data, tasks: [] };
  },

  /**
   * Delete a Goal
   */
  async deleteGoal(goalId) {
    console.log("[DB Debug] Deleting goal ID:", goalId);
    const client = window.getSupabaseClient();
    const { error } = await client
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error("[DB Debug] ❌ Delete goal error:", error.message);
      throw error;
    }
    console.log("[DB Debug] ✅ Goal deleted.");
  },

  /**
   * Create a new Task (Level 2)
   */
  async createTask(userId, goalId, title) {
    console.log("[DB Debug] Creating task under goal:", goalId, title);
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

    if (error) {
      console.error("[DB Debug] ❌ Create task error:", error.message);
      throw error;
    }
    console.log("[DB Debug] ✅ Task created with ID:", data.id);
    return { ...data, subtasks: [] };
  },

  /**
   * Delete a Task
   */
  async deleteTask(taskId) {
    console.log("[DB Debug] Deleting task ID:", taskId);
    const client = window.getSupabaseClient();
    const { error } = await client
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error("[DB Debug] ❌ Delete task error:", error.message);
      throw error;
    }
  },

  /**
   * Create a new Subtask (Level 3)
   */
  async createSubtask(userId, taskId, title) {
    console.log("[DB Debug] Creating subtask under task:", taskId, title);
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

    if (error) {
      console.error("[DB Debug] ❌ Create subtask error:", error.message);
      throw error;
    }
    console.log("[DB Debug] ✅ Subtask created with ID:", data.id);
    return data;
  },

  /**
   * Toggle Subtask Completion Status
   */
  async toggleSubtask(subtaskId, completed) {
    console.log("[DB Debug] Toggling subtask:", subtaskId, "->", completed);
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('subtasks')
      .update({ completed })
      .eq('id', subtaskId)
      .select()
      .single();

    if (error) {
      console.error("[DB Debug] ❌ Toggle subtask error:", error.message);
      throw error;
    }
    return data;
  },

  /**
   * Delete a Subtask
   */
  async deleteSubtask(subtaskId) {
    console.log("[DB Debug] Deleting subtask ID:", subtaskId);
    const client = window.getSupabaseClient();
    const { error } = await client
      .from('subtasks')
      .delete()
      .eq('id', subtaskId);

    if (error) {
      console.error("[DB Debug] ❌ Delete subtask error:", error.message);
      throw error;
    }
  },

  /**
   * Fetch User Streak Record from `streaks` table
   */
  async fetchStreak(userId) {
    console.log("[DB Debug] Fetching streak for user:", userId);
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) console.error("[DB Debug] fetchStreak error:", error.message);
    
    if (!data) {
      console.log("[DB Debug] Streak row missing. Creating new record...");
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
   */
  async recordDailyCheckIn(userId, completedSubtasksCount = 0) {
    console.log("[DB Debug] Executing daily check-in for user:", userId);
    const client = window.getSupabaseClient();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Check if user ALREADY checked in today
    const { data: existingCheckIn } = await client
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', todayStr)
      .maybeSingle();

    const streakRecord = await this.fetchStreak(userId);

    if (existingCheckIn) {
      console.log("[DB Debug] User already checked in today.");
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
        newCurrentStreak = (streakRecord.current_streak || 0) + 1;
      } else if (diffDays === 0) {
        newCurrentStreak = streakRecord.current_streak || 1;
      } else {
        newCurrentStreak = 1; // Streak resets
      }
    } else {
      newCurrentStreak = 1;
    }

    const newLongestStreak = Math.max(newCurrentStreak, streakRecord.longest_streak || 0);

    // 3. Record Check-in
    const { error: checkInError } = await client
      .from('daily_checkins')
      .insert({
        user_id: userId,
        checkin_date: todayStr,
        subtasks_completed_count: completedSubtasksCount
      });

    if (checkInError) {
      console.error("[DB Debug] ❌ Check-in insert error:", checkInError.message);
      throw checkInError;
    }

    // 4. Update Streak record
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

    if (streakUpdateError) {
      console.error("[DB Debug] ❌ Streak update error:", streakUpdateError.message);
      throw streakUpdateError;
    }

    console.log("[DB Debug] ✅ Daily check-in recorded! New Streak:", newCurrentStreak);
    return { 
      alreadyCheckedIn: false, 
      message: "Daily Check-in Recorded! 🔥", 
      streak: updatedStreak 
    };
  },

  /**
   * Fetch Check-ins for Calendar View
   */
  async fetchCalendarCheckIns(userId, year, month) {
    console.log("[DB Debug] Fetching calendar check-ins for:", year, month + 1);
    const client = window.getSupabaseClient();
    
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayNum = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`;

    const { data, error } = await client
      .from('daily_checkins')
      .select('checkin_date, subtasks_completed_count')
      .eq('user_id', userId)
      .gte('checkin_date', startDate)
      .lte('checkin_date', endDate);

    if (error) {
      console.error("[DB Debug] ❌ Calendar query error:", error.message);
      throw error;
    }

    const checkInMap = {};
    (data || []).forEach(row => {
      checkInMap[row.checkin_date] = true;
    });

    console.log("[DB Debug] ✅ Calendar check-ins loaded:", Object.keys(checkInMap).length, "days checked in.");
    return checkInMap;
  },

  /**
   * Update Profile Name
   */
  async updateProfile(userId, fullName) {
    console.log("[DB Debug] Updating profile full_name for:", userId);
    const client = window.getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error("[DB Debug] ❌ Profile update error:", error.message);
      throw error;
    }
    console.log("[DB Debug] ✅ Profile updated.");
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

    if (error) console.error("[DB Debug] fetchUserProfile error:", error.message);
    return data;
  }
};
