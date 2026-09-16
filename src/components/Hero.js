import React, { useEffect, useState } from 'react';
import '../styles/Hero.css';
import { FaBook } from "react-icons/fa";

const HIGHLIGHT_PHRASES = [
  'International Nursing',
  'NCLEX-RN Success',
  'DHA & Prometric',
];

const JuggleText = ({ text, accent = false }) => (
  <span className={accent ? 'hero-juggle hero-juggle-accent' : 'hero-juggle'} aria-label={text}>
    {text.split(' ').map((word, wordIndex, words) => (
      <span className="hero-word" key={`${text}-w${wordIndex}`}>
        {word.split('').map((char, index) => (
          <span
            className="hero-letter"
            style={{ '--i': wordIndex * 8 + index }}
            key={`${text}-${wordIndex}-${index}`}
          >
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 ? '\u00A0' : null}
      </span>
    ))}
  </span>
);

const Hero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % HIGHLIGHT_PHRASES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="hero-container">
        <span className="hero-glow hero-glow-1" aria-hidden="true" />
        <span className="hero-glow hero-glow-2" aria-hidden="true" />
        <span className="hero-glow hero-glow-3" aria-hidden="true" />

        <div className="hero-content-main">
          <div className="hero-content">
            <span className="hero-badge">NCLEX-RN • DHA • Prometric</span>
            <h1 className="hero-title">
              <JuggleText text="Achieve Your" />
              {' '}
              <JuggleText text={HIGHLIGHT_PHRASES[phraseIndex]} accent />
              {' '}
              <JuggleText text="Goals with Confidence" />
            </h1>

            <div className="hero-subtitle">
              <FaBook className="book-icon" />
              <h2>Achieve top ranks in entrance exams</h2>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h2>4.9/5</h2>
              <p>Positive Reviews</p>
            </div>
            <div className="stat-item">
              <h2>5+</h2>
              <p>Course Count</p>
            </div>
            <div className="stat-item">
              <h2>10+ Years</h2>
              <p>Experienced Mentors</p>
            </div>
            <div className="stat-item">
              <h2>GCC Jobs</h2>
              <p>Placement Support</p>
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
