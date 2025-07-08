import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
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
          <li><Link to="/about" onClick={closeMenu}>About us</Link></li>
          <li><Link to="/courses" onClick={closeMenu}>Courses</Link></li>
          <li><Link to="/testimonials" onClick={closeMenu}>Testimonials</Link></li>
          <li><Link to="/sample-questionnaire" onClick={closeMenu}>Sample Questionnaire</Link></li>
          <li><Link to="/contact-us" onClick={closeMenu}>Contact Us</Link></li>
          <li className="mobile-login"><Link to="/login" onClick={closeMenu}>Login</Link></li>
        </ul>

        <div className="login-button desktop-only">
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
