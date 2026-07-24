/**
 * Landing Page Motivation & Quotes Section
 */

window.MotivationSection = function() {
  const quotes = [
    {
      quote: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
      author: "Bruce Lee",
      role: "Martial Artist & Philosopher"
    },
    {
      quote: "You do not rise to the level of your goals. You fall to the level of your systems. Small daily habits compound into massive life transformations.",
      author: "James Clear",
      role: "Author of Atomic Habits"
    },
    {
      quote: "Discipline is doing what you hate to do, but doing it like you love it.",
      author: "Mike Tyson",
      role: "Heavyweight Champion"
    },
    {
      quote: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'",
      author: "Muhammad Ali",
      role: "Global Icon & Boxing Champion"
    },
    {
      quote: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
      author: "Steve Jobs",
      role: "Co-Founder of Apple"
    },
    {
      quote: "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.",
      author: "Arnold Schwarzenegger",
      role: "Bodybuilder & Entrepreneur"
    }
  ];

  return (
    <section id="motivation" className="section-container" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
      <div className="section-header">
        <span className="badge badge-flame" style={{ marginBottom: 12 }}>Mindset matters</span>
        <h2 className="section-title">Words from the World's Best</h2>
        <p className="section-description">
          Consistency is the bridge between goals and accomplishment.
        </p>
      </div>

      <div className="quotes-grid">
        {quotes.map((q, i) => (
          <div key={i} className="glass-card quote-card">
            <div className="quote-icon">“</div>
            <p className="quote-text">{q.quote}</p>
            <div>
              <div className="quote-author">{q.author}</div>
              <div className="quote-role">{q.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
