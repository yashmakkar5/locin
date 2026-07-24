/**
 * Locin Application Entrypoint & Main Layout Component
 * Author: 3rd Year CSE Engineering Project
 */

const { useState, useEffect } = React;

function AppContent() {
  const { authView, setAuthView } = window.useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Refresh Lucide Icons on view update
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [authView, activeTab]);

  if (authView === 'landing') {
    return (
      <div className="app-container">
        <window.Header onNavigateAuth={(mode) => setAuthView(mode)} />
        <window.HeroSection onNavigateAuth={(mode) => setAuthView(mode)} />
        <window.FeaturesSection />
        <window.MotivationSection />
        <window.CompoundingSection />
        <window.FinalCtaSection onNavigateAuth={(mode) => setAuthView(mode)} />
      </div>
    );
  }

  if (authView === 'login' || authView === 'signup') {
    return (
      <window.AuthPage 
        mode={authView} 
        onBackToLanding={() => setAuthView('landing')} 
      />
    );
  }

  // Dashboard View
  return (
    <div className="dashboard-layout">
      <window.Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="dashboard-main">
        {activeTab === 'home' && <window.DashboardHome setActiveTab={setActiveTab} />}
        {activeTab === 'goals' && <window.GoalManager />}
        {activeTab === 'checkin' && <window.DailyCheckIn />}
        {activeTab === 'calendar' && <window.CalendarView />}
        {activeTab === 'stats' && <window.StatsView />}
        {activeTab === 'profile' && <window.ProfileView />}
      </main>
    </div>
  );
}

function App() {
  return (
    <window.AuthProvider>
      <window.GoalProvider>
        <AppContent />
      </window.GoalProvider>
    </window.AuthProvider>
  );
}

// Render React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
