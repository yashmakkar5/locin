# Locin – Goal Tracker & Habit Building Web Platform

> **Project Type**: Full-Stack Web Application Architecture  
> **Target Audience / Profile**: 3rd Year Computer Science & Engineering (CSE) Student Project  
> **Tech Stack**: React 18, JavaScript (ES6 Modules), Vanilla CSS (Custom Design System), Supabase (Auth & Postgres)  

---

## 🌟 Executive Summary

**Locin** is a modern, high-performance Goal Tracking and Habit Building Platform engineered around the mathematical principle of **compounding daily micro-habits** ($1.01^{365} = 37.8x$).

Designed with a futuristic dark-mode glassmorphic aesthetic, Locin breaks down high-level ambitions into a 3-tier actionable hierarchy (**Goal → Task → Subtask**), tracks continuous momentum through a **Duolingo-inspired Fire Streak system**, and provides real-time progress analytics.

---

## 🏗️ Technical Architecture & Component Hierarchy

```
locin-goal-tracker/
├── index.html                  # Single Page Application HTML5 Shell
├── css/
│   ├── main.css                # Design tokens, CSS variables, glassmorphism utilities
│   ├── landing.css             # Hero, floating 3D cards, feature grid, quotes, compounding tool
│   ├── auth.css                # Minimalist auth container, mesh backdrop, quotes banner
│   └── dashboard.css           # Sidebar, 3-tier tree cards, calendar heatmap, SVG charts
├── js/
│   ├── app.js                  # Main Application Layout & React Root Renderer
│   ├── context/
│   │   ├── AuthContext.js      # Global Auth State & Session Listener
│   │   └── GoalContext.js      # Global Reactive Goal Tree State & LocalStorage Manager
│   ├── services/
│   │   ├── supabaseClient.js   # Supabase Client Initialization & Config Check
│   │   ├── authService.js      # Authentication Layer (Email/Password & Google OAuth)
│   │   └── goalService.js      # Database Query Layer (Goals, Tasks, Subtasks)
│   └── components/
│       ├── common/ (Header, Modal)
│       ├── landing/ (HeroSection, FeaturesSection, MotivationSection, CompoundingSection, FinalCtaSection)
│       ├── auth/ (AuthPage)
│       └── dashboard/ (Sidebar, DashboardHome, GoalManager, DailyCheckIn, CalendarView, StatsView, ProfileView)
├── .env.example                # Supabase API credentials template
├── SUPABASE_GUIDE.md           # SQL Schema scripts & RLS policy documentation
└── README.md                   # Project documentation
```

---

## 🎯 Key Features & Modules

### 1. Motivational Landing Page
- **Hero Section**: Tagline *"Small actions. Massive results."*, 3D glass cards, animated gradient glow, primary CTAs.
- **Features Grid**: 7 interactive cards introducing Goal Management, Daily Check-ins, Streak Tracking, Calendar Progress, Statistics, Dashboard, and Profile.
- **Quotes Carousel**: Quotations from Bruce Lee, James Clear (*Atomic Habits*), Mike Tyson, Muhammad Ali, Steve Jobs, and Arnold Schwarzenegger.
- **Compounding Habit Calculator**: Interactive slider demonstrating $1.01^{365} = 37.8x$ growth vs. $0.99^{365} = 0.03x$ decline.

### 2. Authentication UI (Supabase & Google OAuth Ready)
- Subtle animated mesh gradient background.
- Motivational Bruce Lee / James Clear quote overlay.
- Email/Password forms, "Continue with Google" button, and Instant Demo Mode bypass button.

### 3. 3-Tier Goal Management (Goal → Task → Subtask)
- Example tree built-in:
  - 🎯 **Learn AI**
    - 📌 **Python Basics** → 🔹 *Variables*, 🔹 *Loops*, 🔹 *Functions*
    - 📌 **Machine Learning** → 🔹 *Regression*, 🔹 *Classification*
- Full CRUD operations: Create Goals, Add Tasks, Add Subtasks, Toggle completion, and Delete items.

### 4. Fire Streak System (Duolingo Inspired)
- 🔥 Dynamic streak counter that increments upon completing daily check-ins.
- Celebratory **Canvas Confetti** burst feedback upon check-in completion.

### 5. Calendar Heatmap & Analytics
- Monthly calendar grid highlighting completed habit days.
- SVG/CSS statistics bar charts tracking completion rates and weekly activity distribution.

---

## 🚀 How to Run the Project Locally

No complex Node/NPM build step required! Locin runs natively in any browser:

1. Double click `index.html` (or right-click `index.html` and choose **Open with Live Server** / Chrome / Edge).
2. Click **Get Started** or **Sign In**.
3. Use the instant **Demo Mode** to test adding goals, checking off subtasks, triggering confetti, viewing calendar heatmaps, and checking analytics.

---

## 🛠️ Database Schema & Security (Supabase Integration)

Refer to [`SUPABASE_GUIDE.md`](file:///C:/Users/YASH/.gemini/antigravity/scratch/locin-goal-tracker/SUPABASE_GUIDE.md) for complete PostgreSQL creation scripts and Row-Level Security (RLS) policies.
