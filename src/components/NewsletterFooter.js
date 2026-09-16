import React from 'react';
import '../styles/NewsletterFooter.css';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { MdEmail, MdAccessTime } from 'react-icons/md';
import {
  WA_CHANNEL_URL,
  WA_CHAT_HREF,
  WA_PHONE_HREF,
  formatWaPhoneDisplay,
} from '../config/whatsapp';

const NewsletterFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/">
            <img src="/images/logo.png" alt="David's Academy" className="footer-logo" />
          </Link>
          <p className="footer-tagline">
            NCLEX-RN and international nursing coaching with daily practice support.
          </p>
          <a
            href={WA_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link footer-contact-link-channel"
          >
            <span className="footer-icon footer-icon-channel" aria-hidden="true">
              <FaWhatsapp />
            </span>
            <span>
              <strong>WhatsApp Channel</strong>
              <span className="footer-contact-value">Follow for daily questions</span>
            </span>
          </a>
          <a
            href={WA_CHAT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <span className="footer-icon footer-icon-wa" aria-hidden="true">
              <FaWhatsapp />
            </span>
            <span>
              <strong>WhatsApp</strong>
              <span className="footer-contact-value">{formatWaPhoneDisplay()}</span>
            </span>
          </a>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#HomeAbout">About us</Link></li>
            <li><Link to="/#HomeCourses">Courses</Link></li>
            <li><Link to="/#HomeSampleQuestionnaire">Sample Questionnaire</Link></li>
            <li><Link to="/#HomeTestimonials">Testimonials</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Courses</h4>
          <ul>
            <li>Prometric</li>
            <li>DHA – UAE</li>
            <li>HAAD – Abu Dhabi</li>
            <li>NCLEX – RN – USA</li>
          </ul>
        </div>

        <div className="footer-col footer-contact-col">
          <h4>Contact</h4>
          <a href={WA_PHONE_HREF} className="footer-contact-link">
            <span className="footer-icon" aria-hidden="true">
              <FaPhoneAlt />
            </span>
            <span>
              <strong>Phone</strong>
              <span className="footer-contact-value">{formatWaPhoneDisplay()}</span>
            </span>
          </a>
          <a href="mailto:info@davidacademy.in" className="footer-contact-link">
            <span className="footer-icon" aria-hidden="true">
              <MdEmail />
            </span>
            <span>
              <strong>Email</strong>
              <span className="footer-contact-value">info@davidacademy.in</span>
            </span>
          </a>
          <div className="footer-contact-link footer-contact-static">
            <span className="footer-icon" aria-hidden="true">
              <MdAccessTime />
            </span>
            <span>
              <strong>Working Hours</strong>
              <span className="footer-contact-value">Mon – Sat 9.00 AM – 6.00 PM</span>
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 David's Academy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default NewsletterFooter;
