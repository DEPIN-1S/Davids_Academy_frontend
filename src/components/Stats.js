import React from 'react';
import '../styles/Stats.css';
const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-content">
        <div className="stats-image-wrapper">
          <img src="/images/logo.png" alt="David Academy Logo" className="stats-logo" />
          <img src="/images/woman.png" alt="Mentor" className="mentor-photo" />
        </div>
        <div className="stats-text">
          <p>
            At <span className="highlight">David Academy</span>, we empower students to reach their highest potential through expert coaching, a strong curriculum, and personalized mentoring, building confident, skilled candidates who excel in <span className="highlight-yellow">competitive exams</span> and <span className="highlight-yellow">global opportunities</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
