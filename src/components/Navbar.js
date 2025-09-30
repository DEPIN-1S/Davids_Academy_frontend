import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { useSelector } from 'react-redux';
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);
  // const { user } = useSelector((state) => state.user); //  gets user from redux
  return (
    <nav className="landing-navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src="/images/logo.png" alt="David Academy Logo" className="logo-img" />
          </Link>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/#HomeAbout" onClick={closeMenu}>About us</Link></li>
          <li><Link to="/#HomeCourses" onClick={closeMenu}>Courses</Link></li>
          <li><Link to="/#HomeSampleQuestionnaire" onClick={closeMenu}>Sample Questionnaire</Link></li>
          <li><Link to="/#HomeTestimonials" onClick={closeMenu}>Testimonials</Link></li>
          <li><Link to="/contact-us" onClick={closeMenu}>Contact Us</Link></li>
          {/* Mobile view: show user or login */}
          <li className="mobile-login" onClick={closeMenu}>
            <Link to="/login">Login</Link>
          </li>
        </ul>
        {/* Desktop view: show user or login */}
        <div className="login-button desktop-only">
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
