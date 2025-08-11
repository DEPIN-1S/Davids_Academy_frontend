import React from 'react';
import '../styles/CourseCard.css';

const CourseCard = ({
  title = "Untitled Course",
  description = "",
  highlights = [],
  image = "",
  reverse = false
}) => {
  return (
    <div className={`course-card ${reverse ? 'reverse' : ''}`}>
      <div className="course-text">
        <h3>{title}</h3>
        {description && (
          <p className="course-description">{description}</p>
        )}
        {(highlights && highlights.length > 0) && (
          <ul className="highlights">
            {highlights.map((item, index) => (
              <li key={index}>✔️ {item}</li>
            ))}
          </ul>
        )}
        <button className="buy-btn">
          Buy Now <span className="arrow">→</span>
        </button>
      </div>
      <div className="course-image">
        {image ? (
          <img src={image} alt={title || 'Course Image'} />
        ) : (
          // Optional fallback image or empty div
          <div className="image-fallback">No Image</div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
