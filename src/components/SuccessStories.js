import React, { useEffect, useState } from 'react';
import '../styles/SuccessStories.css';
import { fetchSuccessStories } from '../features/exam/examSlice';
import { useDispatch, useSelector } from 'react-redux';

const SuccessStories = () => {
  const {
    addSuccessStoryLoading,
    addSuccessStoryError,
    addSuccessStoryResult,
    successStories,
  } = useSelector((state) => state.exam);

  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch stories on mount
  useEffect(() => {
    dispatch(fetchSuccessStories());
  }, [dispatch]);

  // Use fetched successStories if available and has imageUrl; fallback to static testimonials
  const stories = successStories && successStories.length > 0
    ? successStories
    : [
      { imageUrl: 'images/asha.png', quote: 'David Academy’s personalized coaching. I passed my NCLEX in my very first attempt and secured my dream placement in the UK.', name: 'Asha P.', role: 'Nursing in UK' },
      { imageUrl: 'images/rahul.png', quote: 'Great faculty, structured learning, and excellent placement guidance. I cleared the HAAD exam and got placed in Abu Dhabi.', name: 'Rahul M.', role: 'Nursing, UAE' },
      { imageUrl: 'images/sneha.png', quote: 'Their SAT prep program was spot on! I improved my score by 200 points and got admission into my first-choice college.', name: 'Sneha R.', role: 'SAT Student' },
    ];

  console.log("Success Stories Data:", stories);

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [stories.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  return (
    <section id='HomeTestimonials' className="success-section">
      <h2 className="success-title">Success Stories at David’s Academy</h2>

      <div className="slider-container classy-marquee">
        <div className="slides-wrapper marquee-track">
          {[...stories, ...stories].map((item, index) => (
            <div className="slide" key={index}>
              <div className="story-card">
                <img
                  src={item.imageUrl}
                  alt={`Story ${index + 1}`}
                  className="story-card-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
};

export default SuccessStories;