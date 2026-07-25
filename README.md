# Locin – Privacy-First, Local-First Productivity Web Application

> **Project Architecture**: 100% Privacy-First, Offline-Capable, Local-First Application  
> **Tech Stack**: React 18, JavaScript (ES6 Modules), Custom Glassmorphic Vanilla CSS  
> **Backend / Server**: NONE required (Zero login, zero database, zero external tracking)  

---

## 🌟 Executive Summary

**Locin** is a privacy-first web application designed for students and developers to set high-level goals, break them down into a 3-tier actionable hierarchy (**Goal → Task → Subtask**), build **Duolingo-inspired Fire Streaks 🔥**, track monthly calendar heatmaps, and measure productivity—all stored **100% privately inside your browser's local storage**.

No accounts, signups, or cloud servers are required. Your data never leaves your device.

---

## 🛡️ Privacy-First Philosophy

> *"Your productivity data stays entirely on your device. LOCIN does not require an account and does not upload your information to any server. Your goals, tasks, streaks, and statistics remain private. Future versions may offer optional cloud sync for users who want access across multiple devices."*

---

## 📥 Backup & Restore Guide

Locin includes a dedicated **Backup & Restore** engine inside **Settings & Backup**:

### 1. Export Data (JSON Backup)
Click **Download Backup JSON** to download a copy of all your goals, tasks, subtasks, streaks, calendar history, statistics, and settings as a JSON file named:
```
locin-backup-YYYY-MM-DD.json
```

### 2. Import Data (Restore JSON)
Click **Select JSON File to Restore** and select a previously exported `locin-backup-YYYY-MM-DD.json` file. The application validates the file schema, restores all records to local storage, and refreshes the application automatically.

### 3. Reset All Data
Click **Reset All Data** to clear all stored goals, tasks, streaks, and calendar history after confirming the warning dialog (`"Are you sure? This will permanently delete all locally stored data."`).

---

## 📱 Mobile Compatibility & Performance

- **Responsive Grid & Flexbox**: Optimized for Desktop, Android, iPhone Safari, and Tablets.
- **Touch Friendly**: Large touch targets, custom styled checkboxes, and intuitive drawer navigation.
- **Offline Capable**: Works 100% offline without requiring internet access after loading assets.

---

## 🗺️ Project Roadmap

### Version 1.0 (Current Version)
- ✅ Local-first browser storage (`localStorage`)
- ✅ Zero account or signup required
- ✅ Fast, instant performance
- ✅ Privacy-first device design
- ✅ Works 100% offline
- ✅ JSON Backup & Restore engine

### Planned Future Versions
- 🔹 Optional Cloud Synchronization
- 🔹 Google & Email OAuth Login
- 🔹 Cross-device automatic synchronization
- 🔹 Encrypted Cloud Backups
- 🔹 Shared Goals & Collaboration
- 🔹 Web Push Notifications & Reminders

---

## 📁 File Structure

```
lockin/
├── index.html                   # Single Page Application HTML5 Shell & Inline Components
├── README.md                    # Project Architecture & Usage Documentation
├── css/
│   ├── main.css                 # CSS Custom Properties, Theme Tokens, Reset
│   ├── landing.css              # Hero section, feature cards, quote carousel, compounding tool
│   ├── auth.css                 # Container styles
│   └── dashboard.css            # Sidebar layout, 3-tier hierarchy cards, calendar heatmap, charts
└── js/
    └── services/
        └── storageService.js    # LocalStorage Manager & JSON Backup/Restore Engine
```

---

## 🚀 How to Run Locally

You can run Locin in your browser in two easy ways:

### Option A: Local Web Server (Recommended)
Open a terminal in the project folder and run:
```bash
python -m http.server 3000
```
Then visit: **[http://localhost:3000](http://localhost:3000)**

### Option B: Direct File Open
Double click [index.html](file:///C:/Users/YASH/OneDrive/Desktop/lockin/index.html) in `C:\Users\YASH\OneDrive\Desktop\lockin`.
