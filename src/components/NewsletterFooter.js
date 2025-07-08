import React from 'react';
import '../styles/NewsletterFooter.css';
const NewsletterFooter = () => {
  return (
    <footer className="footer">
      {/* Top Grid */}
      <div className="footer-grid">
        {/* Left: Logo & Newsletter */}
        <div className="footer-left">
          <img src='/images/logo.png' alt="David's Academy Logo" className="footer-logo" />
          <h3 className="newsletter-title">Subscribe to Newsletter</h3>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
          <label className="terms">
            <input type="checkbox" />
            I agree to the terms and conditions.
          </label>
        </div>

        {/* Right: Quick Links & Courses */}
        <div className="footer-links-section">
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/testimonials">Testimonials</a></li>
              <li><a href="/contact-us">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4>Courses</h4>
            <ul>
              <li><a href="/">Prometric</a></li>
              <li><a href="/">DHA – UAE</a></li>
              <li><a href="/">HAAD – Abu Dhabi</a></li>
              <li><a href="/">NCLEX – RN – USA</a></li>
              <li><a href="/">Crash Courses</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="footer-contact">
        <div><strong>▶ Phone / WhatsApp</strong><br />+91 88912 27455</div>
        <div><strong>▶ Email</strong><br />info@davidacademy.in</div>
        <div><strong>▶ Working Hours</strong><br />Mon – Sat 9.00 AM – 6.00 PM, Sunday : Closed</div>
      </div>

      <hr />

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2025 David's Academy. All rights reserved. | Designed by Lunar Enterprises</p>
      </div>
    </footer>
  );
};

export default NewsletterFooter;
