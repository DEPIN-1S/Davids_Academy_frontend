import React from 'react';
import '../styles/Hero.css';
import { FaBook } from "react-icons/fa";


const Hero = () => {
  return (
    <>
      <section className="hero-container">
        <div className='hero-content-main' >
          <div className="hero-content">
            <h1 className="hero-title">
              Achieve Your International Nursing Goals with Confidence
            </h1>

            <div className="hero-subtitle">
              <FaBook className='book-icon' />
              <h1> Achieve top ranks in entrance exams</h1>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h2>4.9/5</h2>
              <p>Positive Reviews</p>
            </div>
            <div className="stat-item">
              <h2>30+</h2>
              <p>Course Count</p>
            </div>
            <div className="stat-item">
              <h2>10+Years</h2>
              <p>Experienced Mentors</p>
            </div>
            <div className="stat-item">
              <h2>15+ Countries</h2>
              <p>Placement Assistance</p>
            </div>
          </div>

        </div>


        <div className="hero-image-wrapper">
          <img src="/images/Group24.png" alt="Nurse illustration" className="hero-image" />
        </div>
      </section>

      <div className="hero-stats-small">
        <div className="stat-item-small">
          <h2>4.9/5</h2>
          <p>Positive Reviews</p>
        </div>
        <div className="stat-item-small">
          <h2>30+</h2>
          <p>Course Count</p>
        </div>
        <div className="stat-item-small">
          <h2>10+Years</h2>
          <p>Experienced Mentors</p>
        </div>
        <div className="stat-item-small">
          <h2>15+ Countries</h2>
          <p>Placement Assistance</p>
        </div>
      </div>
    </>
  );
};

export default Hero;
