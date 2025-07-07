import React from 'react';
// import './HeroSection.css'; // Don't forget to create a CSS file for styling

const Courses = () => {
  return (
      <section id="courses">
            <h2>Our Courses</h2>
            <div class="course">
                <h3>NCLEX Coaching</h3>
                <p>Prepare for NCLEX with our intensive program.</p>
                <p>Duration: 6 months</p>
                <button>Learn More</button>
            </div>
            <div class="course">
                <h3>Prometric Coaching</h3>
                <p>Ready for Prometric examinations with expert guidance.</p>
                <p>Duration: 3 months</p>
                <button>Learn More</button>
            </div>
            <div class="course">
                <h3>DHA - UAE Exam Prep</h3>
                <p>Be fully prepared and confident for the DHA exam.</p>
                <p>Duration: 3 months</p>
                <button>Learn More</button>
            </div>
        </section>
  );
};

export default Courses;
