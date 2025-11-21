import React, { useEffect } from "react";
import "../../styles/ResultModal.css";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";



function ResultModal({ open, handleClose, isAnswerCorrect }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => handleClose(), 3000);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="luxe-overlay">
        {/* Animated Background Particles */}
        <div className="cosmic-particles">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="cosmic-particle"
              style={{
                '--pos-x': `${Math.random() * 100}%`,
                '--pos-y': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 3}s`,
                '--duration': `${Math.random() * 4 + 3}s`,
                '--size': `${Math.random() * 5 + 2}px`
              }}
            />
          ))}
        </div>

        <div className={`luxe-modal ${isAnswerCorrect ? 'mode-success' : 'mode-error'}`}>

          {/* Rotating Hexagon Particles */}
          <div className="hex-particles">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="hex-particle"
                style={{
                  '--rotation': `${i * 45}deg`,
                  '--orbit-delay': `${i * 0.2}s`
                }}
              />
            ))}
          </div>

          {/* Diagonal Light Beams */}
          <div className="light-beams">
            <div className="beam beam-1"></div>
            <div className="beam beam-2"></div>
            <div className="beam beam-3"></div>
          </div>

          {/* Central Content */}
          <div className="modal-content">

            {/* Animated Icon Container */}
            <div className="icon-stage">
              {/* Rotating Orbit Rings */}
              <div className="orbit-ring orbit-1"></div>
              <div className="orbit-ring orbit-2"></div>
              <div className="orbit-ring orbit-3"></div>

              {/* Icon Core */}
              <div className="icon-core">
                <div className="icon-inner">
                  
                  <span className="icon-symbol">
                    {isAnswerCorrect ? <FaCheck/>  : <RxCross2 />}
                  </span>
                </div>
              </div>

              {/* Orbiting Dots */}
              <div className="orbit-dots">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="orbit-dot"
                    style={{
                      '--dot-angle': `${i * 90}deg`,
                      '--dot-delay': `${i * 0.25}s`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Text Content */}
            <div className="text-content">
              <h1 className="modal-heading">
                <span className="heading-word">{isAnswerCorrect ? "Correct Answer" : "Incorrect Answer"}</span>
               
              </h1>

              <p className="modal-message">
                {isAnswerCorrect
                  ? "Your brilliance shines through. Exceptional performance!"
                  : "That wasn’t the correct choice, but growth happens with each attempt."}
              </p>

              {/* Animated Divider */}
              <div className="divider-container">
                <div className="divider-line"></div>
                <div className="divider-glow"></div>
              </div>

              {/* Status Indicator */}
              <div className="status-container">
                <div className="status-label">
                {isAnswerCorrect ? "SUCCESS" : "ATTEMPT COMPLETED"}
                </div>
                <div className="status-meter">
                  <div className="meter-track"></div>
                  <div className="meter-fill"></div>
                  <div className="meter-shine"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="corner-accent corner-tl"></div>
          <div className="corner-accent corner-tr"></div>
          <div className="corner-accent corner-bl"></div>
          <div className="corner-accent corner-br"></div>

          {/* Floating Energy Particles */}
          <div className="energy-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="energy-particle"
                style={{
                  '--energy-x': `${Math.random() * 100}%`,
                  '--energy-y': `${Math.random() * 100}%`,
                  '--energy-delay': `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultModal;
