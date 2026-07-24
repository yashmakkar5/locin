# Supabase Integration & Database Setup Guide

> **Project**: Locin Goal Tracker  
> **Course / Profile**: 3rd Year CSE Engineering Project  

This guide provides step-by-step instructions for initializing Supabase Authentication (Email/Password & Google OAuth) and creating the PostgreSQL Database Schema with Row-Level Security (RLS) policies.

---

## 1. Where to Add Supabase Environment Variables

Create a file named `.env` in the project root directory (or update `js/services/supabaseClient.js`):

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. File Initialization Overview

| File Location | Function / Responsibility |
| :--- | :--- |
| `js/services/supabaseClient.js` | Initializes the Supabase JS client using `createClient(URL, ANON_KEY)` |
| `js/services/authService.js` | Connects Email/Password signup, signin, and Google OAuth |
| `js/services/goalService.js` | Executes PostgreSQL queries for Goals, Tasks, Subtasks, Check-ins |
| `js/context/AuthContext.js` | Listens to `supabase.auth.onAuthStateChange` session updates |

---

## 3. SQL Database Schema & RLS Policies

Run the following SQL script directly inside the **Supabase SQL Editor** to create all tables and secure user data:

```sql
-- ============================================================================
-- LOCIN GOAL TRACKER - DATABASE SCHEMA & RLS POLICIES
-- ============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_checkin_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Create Goals Table (Level 1 Hierarchy)
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals" 
ON public.goals FOR ALL 
USING (auth.uid() = user_id);

-- 3. Create Tasks Table (Level 2 Hierarchy)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks" 
ON public.tasks FOR ALL 
USING (auth.uid() = user_id);

-- 4. Create Subtasks Table (Level 3 Hierarchy)
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Subtasks
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subtasks" 
ON public.subtasks FOR ALL 
USING (auth.uid() = user_id);

-- 5. Create Daily Check-ins Table
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  check_in_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Check-ins
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own check-ins" 
ON public.check_ins FOR ALL 
USING (auth.uid() = user_id);
```

---

## 4. Enabling Google OAuth Sign-In

1. In Supabase Dashboard, navigate to **Authentication > Providers > Google**.
2. Toggle **Enable Google Provider**.
3. Obtain Client ID and Client Secret from **Google Cloud Console > Credentials > OAuth 2.0 Client IDs**.
4. Add Supabase Redirect URL (`https://<project-ref>.supabase.co/auth/v1/callback`) to your Google Console Authorized Redirect URIs.

---

## 5. How User Data Isolation Works

Because every query includes Row-Level Security (`auth.uid() = user_id`), users logged into Locin will strictly **only read and write their own goals, tasks, subtasks, and streaks** without any cross-user data leakage.
