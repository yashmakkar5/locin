/**
 * ============================================================================
 * Goal Management & Database Service Module
 * Handles CRUD operations for 3-Tier Hierarchy (Goals -> Tasks -> Subtasks),
 * Daily Check-ins, and 🔥 Fire Streak Tracking.
 * ============================================================================
 */

window.goalService = {
  /**
   * Fetch Goals with nested Tasks & Subtasks for a specific user
   */
  async fetchUserGoals(userId) {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE DB CONNECTION POINT:
         Query goals table with joined tasks and subtasks */
      const { data, error } = await window.supabase
        .from('goals')
        .select(`
          *,
          tasks (
            *,
            subtasks (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching goals from Supabase:", error.message);
        throw error;
      }
      return data;
    }
    
    // DEMO LOCALSTORAGE FALLBACK
    const key = `locin_goals_${userId || 'demo'}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Save / Sync Goals to Persistence Layer
   */
  async syncGoals(userId, goalsData) {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE DB CONNECTION POINT:
         Insert/Update goals table in Supabase */
      // Handled via specific upserts in production
      return;
    }

    // DEMO LOCALSTORAGE FALLBACK
    const key = `locin_goals_${userId || 'demo'}`;
    localStorage.setItem(key, JSON.stringify(goalsData));
  },

  /**
   * Record Daily Check-in and Update 🔥 Fire Streak
   */
  async recordCheckIn(userId, currentStreakData) {
    if (window.isSupabaseConfigured() && window.supabase) {
      /* SUPABASE DB CONNECTION POINT:
         1. Insert row into check_ins table
         2. Update user profile streak counters */
      const today = new Date().toISOString().split('T')[0];
      
      await window.supabase.from('check_ins').insert({
        user_id: userId,
        check_in_date: today
      });

      await window.supabase.from('profiles').update({
        current_streak: currentStreakData.current,
        longest_streak: currentStreakData.longest,
        last_checkin_date: today
      }).eq('id', userId);
    }
  }
};
