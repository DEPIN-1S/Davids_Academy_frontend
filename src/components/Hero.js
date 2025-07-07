import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Achieve Your International <br /> Nursing Goals with Confidence
        </h1>
        <p className="hero-subtitle">Achieve top ranks in entrance exams</p>

        <div className="hero-stats">
          <div className="stat-item">
            <h2>4.9/5</h2>
            <p>Positive Reviews</p>
          </div>
          <div className="stat-item">
            <h2>30+</h2>
            <p>Courses Count</p>
          </div>
          <div className="stat-item">
            <h2>10+ Years</h2>
            <p>Experienced Mentors</p>
          </div>
          <div className="stat-item">
            <h2>15+</h2>
            <p>Countries Placement Assistance</p>
          </div>
        </div>

        <p className="hero-description">
          At <strong>David Academy</strong>, we empower students to reach their highest potential through expert coaching, a strong curriculum, and personalized mentoring, building confident, skilled candidates who excel in global opportunities.
        </p>

        <button className="hero-button">Explore Courses</button>
      </div>

      <div className="hero-image">
        <img src="/images/doctor.png" alt="Nurse illustration" />
      </div>
    </section>
  );
};

export default Hero;
