import React from 'react';
import '../styles/CourseCard.css';

const CourseCard = ({ title, description, highlights = [], image, reverse }) => {
  return (
    <div className={`course-card ${reverse ? 'reverse' : ''}`}>
      <div className="course-text">
        <h3>{title}</h3>
        <p className="course-description">{description}</p>
        <ul className="highlights">
          {highlights.map((item, index) => (
            <li key={index}>✔️ {item}</li>
          ))}
        </ul>
        <button className="buy-btn">
          Buy Now <span className="arrow">→</span>
        </button>
      </div>
      <div className="course-image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
};

export default CourseCard;
