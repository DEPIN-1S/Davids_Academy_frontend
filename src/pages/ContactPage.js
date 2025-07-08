import React from 'react';
import '../styles/ContactPage.css';

const ContactPage = () => {
  return (
    <section className="contact-form-section">
      <div className="contact-form-container">
        <h2>Have Questions? Get in Touch!</h2>
        <p>Our team is ready to help you choose the right course and start your healthcare career journey</p>
        <form className="contact-form">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" placeholder="Your full name" required />

          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" placeholder="Your phone number" required />

          <label htmlFor="course">Course Interested In</label>
          <input type="text" id="course" name="course" placeholder="e.g., NCLEX-RN" required />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="4" placeholder="Your questions or notes..."></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
      <img className="background-wave" src="/images/wave.png" alt="Background wave" />
    </section>
  );
};

export default ContactPage;
