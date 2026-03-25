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


  const stories = successStories && successStories.length > 0 ? successStories : [];
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
                  src={`${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}${item.imageUrl}`}
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