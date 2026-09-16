import React, { useEffect, useState } from 'react';
import '../styles/SuccessStories.css';
import { fetchSuccessStories } from '../features/exam/examSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  successStoryImageFallback,
  successStoryImageSrc,
} from '../config/media';

const SuccessStories = () => {
  const {
    successStories,
    fetchLoading,
  } = useSelector((state) => state.exam);

  const dispatch = useDispatch();
  const [, setCurrentIndex] = useState(0);
  const [hiddenIds, setHiddenIds] = useState(() => new Set());

  useEffect(() => {
    dispatch(fetchSuccessStories());
  }, [dispatch]);

  const stories = (Array.isArray(successStories) ? successStories : []).filter(
    (story) => !hiddenIds.has(story.id)
  );

  useEffect(() => {
    if (stories.length === 0) return undefined;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [stories.length]);

  const handleImageError = (event, story) => {
    const fallback = successStoryImageFallback(story);
    const currentSrc = event.target.currentSrc || event.target.src;
    if (
      fallback &&
      event.target.dataset.fallback !== '1' &&
      currentSrc !== fallback
    ) {
      event.target.dataset.fallback = '1';
      event.target.src = fallback;
      return;
    }
    setHiddenIds((current) => {
      const next = new Set(current);
      next.add(story.id);
      return next;
    });
  };

  return (
    <section id="HomeTestimonials" className="success-section">
      <h2 className="success-title">Success Stories at David’s Academy</h2>

      {stories.length === 0 && !fetchLoading ? (
        <p className="success-empty">Student success stories will appear here soon.</p>
      ) : (
        <div className="slider-container classy-marquee">
          <div className="slides-wrapper marquee-track">
            {[...stories, ...stories].map((item, index) => (
              <div className="slide" key={`${item.id || index}-${index}`}>
                <div className="story-card">
                  <img
                    src={successStoryImageSrc(item)}
                    alt={`Success story ${item.id || index + 1}`}
                    className="story-card-image"
                    onError={(event) => handleImageError(event, item)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SuccessStories;
