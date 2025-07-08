import React from 'react';
import '../styles/WhyChoose.css';


const features = [
  {
    title: 'Experienced Mentors',
    description: 'Learn from educators with over 10+ years of proven results in competitive exam coaching.',
  },
  {
    title: 'Comprehensive Course Selection',
    description: '30+ specialized programs tailored to nursing, language, and academic entrance tests.',
  },
  {
    title: 'Global Placement Assistance',
    description: 'We support your career goals with placement help in 15+ countries worldwide.',
  },
  {
    title: 'Proven Student Success',
    description: 'We support your career goals with placement help in 15+ countries worldwide.',
  },
  {
    title: 'Global Placement Assistance',
    description: 'We support your career goals with placement help in 15+ countries worldwide.',
  },
  {
    title: 'Proven Student Success',
    description: 'We support your career goals with placement help in 15+ countries worldwide.',
  },
];

const WhyChoose = () => {
  return (
    <section className="why-choose">
      <div className="why-header">
        <div className="text-block">
          <h2>Why Choose David Academy?</h2>
          <p>Empowering Your Success with Expertise, Care, and Results</p>
        </div>
        <div className="image-block">
          <img src="/images/groupImage.png" alt="Students" />
        </div>
      </div>

      <div className="why-grid">
        {features.map((item, index) => (
          <div className="why-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <button className="learn-more">Learn More About Us →</button>
    </section>
  );
};

export default WhyChoose;
