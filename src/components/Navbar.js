import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">  
          <img src="/images/logo.png" alt="David Academy Logo" className="logo-img" />
          </Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About us</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/testimonials">Testimonials</Link></li>
          <li><Link to="/sample-questionnaire">Sample Questionnaire</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
        </ul>
        <div className="login-button">
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
