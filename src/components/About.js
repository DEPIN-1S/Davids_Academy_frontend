import React from 'react';
import '../styles/About.css'

// import './HeroSection.css'; // Don't forget to create a CSS file for styling

const About = () => {
  return (
    <div id="HomeAbout"  className="about">
      {/* Left side image */}
      <img src="/images/Group9.svg" alt="About David Academy" className="about-img" />

      {/* Right side text */}
      <div className="about-txt">
        <h1>
          At <span className="highlight">David Academy</span>, we empower students to reach their highest potential
          through expert coaching, a strong curriculum, and personalized mentoring, building confident, skilled
          candidates who excel in <span className="highlight">competitive exams</span> and
          <span className="highlight"> global opportunities</span>.
        </h1>
      </div>
    </div>
  );
};

export default About;
