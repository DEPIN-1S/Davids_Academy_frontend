import React from 'react';
import '../styles/SuccessStories.css';


const testimonials = [
  {
    quote: 'David Academy’s personalized coaching. I passed my NCLEX in my very first attempt and secured my dream placement in the UK.',
    name: 'Asha P.',
    role: 'Nursing in UK',
    avatar: 'images/asha.png',
  },
  {
    quote: 'Great faculty, structured learning, and excellent placement guidance. I cleared the HAAD exam and got placed in Abu Dhabi.',
    name: 'Rahul M.',
    role: 'Nursing, UAE',
    avatar: 'images/rahul.png',
  },
  {
    quote: 'Their SAT prep program was spot on! I improved my score by 200 points and got admission into my first-choice college.',
    name: 'Sneha R.',
    role: 'SAT Student',
    avatar: 'images/sneha.png',
  },
];

const SuccessStories = () => {
  return (
    <section id='HomeTestimonials' className="success-section">
      <h2 className="success-title">Success Stories at David’s Academy</h2>

      <div className="testimonial-container">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            <div className="quote-icon">❝</div>
            <p className="testimonial-text">{item.quote}</p>
            <div className="testimonial-footer">
              <img src={item.avatar} alt={item.name} className="avatar" />
              <div>
                <p className="student-name">{item.name}</p>
                <p className="student-role">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="testimonial-dots">
        <span className="dot active" />
        <span className="dot" />
        <span className="dot" />
      </div>

      {/* Navigation Arrows */}
      <div className="testimonial-nav">
        <button className="nav-btn">←</button>
        <button className="nav-btn">→</button>
      </div>
    </section>
  );
};

export default SuccessStories;
