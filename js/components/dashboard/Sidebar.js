/**
 * Dashboard Sidebar Component
 */

window.Sidebar = function({ activeTab, setActiveTab }) {
  const { logout, user } = window.useAuth();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'goals', label: 'Goals', icon: 'target' },
    { id: 'checkin', label: 'Daily Check-in', icon: 'check-square' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
    { id: 'stats', label: 'Statistics', icon: 'bar-chart-3' },
    { id: 'profile', label: 'Profile', icon: 'user' }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <a href="#" className="logo-container">
            <div className="logo-icon">
              <i data-lucide="zap" style={{ color: '#fff' }}></i>
            </div>
            <span>locin</span>
          </a>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i data-lucide={item.icon} style={{ width: 18, height: 18 }}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <div>
        <div 
          className="nav-item" 
          onClick={logout}
          style={{ color: '#fca5a5', marginTop: 20 }}
        >
          <i data-lucide="log-out" style={{ width: 18, height: 18 }}></i>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};
