/**
 * Landing Page Features Section
 */

window.FeaturesSection = function() {
  const features = [
    {
      icon: 'target',
      title: '3-Tier Goal Management',
      desc: 'Organize overarching Goals into actionable Tasks, and break Tasks into quick Subtasks (e.g. Learn AI → Python → Variables).'
    },
    {
      icon: 'check-circle-2',
      title: 'Daily Check-ins',
      desc: 'Satisfying one-click check-ins with celebratory confetti bursts that reinforce positive daily habits.'
    },
    {
      icon: 'flame',
      title: 'Duolingo Fire Streak',
      desc: 'Build unstoppable momentum with visual 🔥 streak tracking that grows bigger as you stay consistent.'
    },
    {
      icon: 'calendar',
      title: 'Calendar Progress Heatmap',
      desc: 'Visualize your monthly activity with crisp color indicators highlighting completed days and momentum trends.'
    },
    {
      icon: 'bar-chart-3',
      title: 'Rich Statistics & Analytics',
      desc: 'Track goal completion rates, weekly activity distribution, and streak milestones with lightweight charts.'
    },
    {
      icon: 'layout-dashboard',
      title: 'Personalized Dashboard',
      desc: 'A clean, dark, glassmorphic command center tailored for maximum focus and rapid daily task execution.'
    },
    {
      icon: 'user-check',
      title: 'Profile & Achievements',
      desc: 'Manage your scholar identity, view milestone badges, and review total completed goals over time.'
    }
  ];

  return (
    <section id="features" className="section-container">
      <div className="section-header">
        <span className="badge badge-primary" style={{ marginBottom: 12 }}>Designed for Focus</span>
        <h2 className="section-title">Everything you need to master your goals</h2>
        <p className="section-description">
          Built with precision to help student developers and ambitious builders maintain consistency every day.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="glass-card feature-card">
            <div className="feature-icon-wrapper">
              <i data-lucide={f.icon} style={{ width: 28, height: 28 }}></i>
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
