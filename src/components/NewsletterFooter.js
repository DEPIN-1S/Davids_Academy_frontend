import React, { useState } from 'react';
import '../styles/NewsletterFooter.css';
import { Link as ScrollLink } from "react-scroll"
import { Link } from 'react-router-dom';
const NewsletterFooter = () => {
  const closeMenu = () => setMenuOpen(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
              <li><Link to="/" onClick={closeMenu}  >Home</Link></li>
              <li><Link to="/#HomeAbout" onClick={closeMenu}>About us</Link></li>
              <li><Link to="/#HomeCourses" onClick={closeMenu}>Courses</Link></li>
              <li><Link to="/#HomeSampleQuestionnaire" onClick={closeMenu} >Sample Questionnaire</Link></li>
              <li><Link to="/#HomeTestimonials" onClick={closeMenu}>Testimonials</Link></li>
              <li><Link to="/contact-us" onClick={closeMenu}>Contact Us</Link></li>

            </ul>
          </div>
          <div>
            <h4>Courses</h4>
            <ul>
              <li>Prometric</li>
              <li>DHA – UAE</li>
              <li>HAAD – Abu Dhabi</li>
              <li>NCLEX – RN – USA</li>
              <li>Crash Courses</li>
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
