import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="login-section">
      <div className="login-card">
        <h2>Login</h2>
        <p>
          Sign in to track your courses, connect with mentors, and advance your international healthcare career.
        </p>
        <form className="login-form">
          <label>Email Address</label>
          <div className="input-wrapper">
            <FiUser className="input-icon" />
            <input type="email" placeholder="Enter your email" required />
          </div>

          <label>Password</label>
          <div className="input-wrapper">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="input-icon right">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      <img src="/images/wave.svg" alt="wave" className="wave-bg" />
    </section>
  );
};

export default LoginPage;
