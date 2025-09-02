


import React from 'react';

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
    <section className="why-choose-section">
     
      <div className="bg-decoration bg-decoration-left">
        <svg viewBox="0 0 600 800" fill="none">
          <path d="M0 200C80 120 160 80 280 140C400 200 480 280 520 400C480 520 400 600 280 560C160 520 80 440 0 360V200Z" fill="#4A90E2" opacity="0.08"/>
          <path d="M-100 300C20 220 100 180 220 240C340 300 420 380 460 500C420 620 340 700 220 660C100 620 20 540 -100 460V300Z" fill="#50C878" opacity="0.06"/>
        </svg>
      </div>
      
      <div className="bg-decoration bg-decoration-right">
        <svg viewBox="0 0 600 800" fill="none">
          <path d="M600 150C520 70 440 30 320 90C200 150 120 230 80 350C120 470 200 550 320 510C440 470 520 390 600 310V150Z" fill="#4A90E2" opacity="0.08"/>
          <path d="M700 250C620 170 540 130 420 190C300 250 220 330 180 450C220 570 300 650 420 610C540 570 620 490 700 410V250Z" fill="#50C878" opacity="0.06"/>
        </svg>
      </div>
      
      <div className="why-choose-container">
        <div className="why-header">
          <div className="text-block">
            <h2>Why Choose David Academy?</h2>
            <p>Empowering Your Success with Expertise, Care, and Results</p>
          </div>
          <div className="image-block">
            <div className="image-container">
           <img src="/images/groupImage.png" alt="Students" />
              {/* Star decoration */}
           
            </div>
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
      </div>

      <style jsx>{`
        .why-choose-section {
          position: relative;
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          overflow: hidden;
        }

        .bg-decoration {
          position: absolute;
          width: 400px;
          height: 600px;
          z-index: 1;
          overflow: hidden;
        }

        .bg-decoration svg {
          width: 100%;
          height: 100%;
        }

        .bg-decoration-left {
          top: 0;
          left: -200px;
        }

        .bg-decoration-right {
          top: 50%;
          right: -200px;
          transform: translateY(-50%);
        }

        .why-choose-container {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
        }

        .why-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4rem;
          gap: 3rem;
        }

        .text-block {
          flex: 1;
          max-width: 500px;
        }

        .text-block h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .text-block p {
          font-size: 1.2rem;
          color: #64748b;
          line-height: 1.6;
        }

        .image-block {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .image-container {
          position: relative;
          max-width: 450px;
        }

        .image-container img {
          width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .star-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          animation: rotate 8s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

.why-card {
  background: rgba(255, 255, 255, 0.25); /* transparent white */
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);   /* blur effect */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}


        .why-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4f46e5, #06b6d4, #10b981);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .why-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
        }

        .why-card:hover::before {
          opacity: 1;
        }

        .why-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .why-card p {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media screen and (max-width: 1024px) {
          .why-choose-section {
            padding: 4rem 1.5rem;
          }
          
          .why-header {
            gap: 2rem;
          }
          
          .text-block h2 {
            font-size: 2.2rem;
          }
        }

        @media screen and (max-width: 768px) {
          .why-choose-section {
            padding: 3rem 1rem;
          }

          .why-header {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .text-block {
            max-width: 100%;
          }

          .text-block h2 {
            font-size: 2rem;
          }

          .text-block p {
            font-size: 1.1rem;
          }

          .image-block {
            justify-content: center;
          }

          .image-container {
            max-width: 350px;
          }

          .why-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            max-width: 100%;
          }

          .why-card {
            padding: 1.5rem;
          }

          .bg-decoration-left {
            width: 300px;
            height: 250px;
            left: -100px;
          }

          .bg-decoration-right {
            width: 300px;
            height: 250px;
            right: -100px;
          }
        }

        @media screen and (max-width: 480px) {
          .why-choose-section {
            padding: 2rem 0.5rem;
          }

          .text-block h2 {
            font-size: 1.75rem;
          }

          .text-block p {
            font-size: 1rem;
          }

          .why-card {
            padding: 1.25rem;
          }

          .why-card h3 {
            font-size: 1.1rem;
          }

          .why-card p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyChoose;