import React from 'react';
import '../styles/CourseContactForm.css'; // We'll style this according to the UI

const CourseContactForm = () => {
  return (
    <section className="course-contact-section">
      <div className="course-contact-card">
        <h3>Have Questions? Get in Touch!</h3>
        <p>Our team is happy to help you choose the right course and start your healthcare journey.</p>

        <form className="course-contact-form">
          <input type="text" placeholder="Full Name" name="fullName" required />
          <input type="tel" placeholder="Phone Number" name="phone" required />
          <input type="text" placeholder="Course Interested In" name="course" required />
          <textarea placeholder="Course-related query" name="message" rows="4" />

          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default CourseContactForm;
