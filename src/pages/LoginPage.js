import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/user/userSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      const resultAction = await dispatch(login(values));
      console.log('resultAction', login.fulfilled.match(resultAction));
      if (login.fulfilled.match(resultAction)) {
        const userRole = resultAction.payload?.user?.role;
        console.log('userRole', userRole);
        // ✅ Only one navigate call based on role
        if (userRole === 'student') {
          navigate('/question-bank');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          toast.info('Logged in, but no matching role redirect.');
        }

        toast.success('Login successfull!');
      } else {
        toast.error(resultAction.payload || 'Login failed');
      }
    }

  });

  return (
    <section className="login-section">
      <ToastContainer />
      <div className="login-card">
        <h2>Login</h2>
        <p>
          Sign in to track your courses, connect with mentors, and advance your international healthcare career.
        </p>

        <form className="login-form" onSubmit={formik.handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <FiUser className="input-icon" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              {...formik.getFieldProps('email')}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="error-text">{formik.errors.email}</div>
          )}

          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <FiLock className="input-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              {...formik.getFieldProps('password')}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="input-icon right"
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="error-text">{formik.errors.password}</div>
          )}

          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Submit'}
          </button>
        </form>
      </div>

      <img src="/images/wave.svg" alt="wave" className="wave-bg" />
    </section>
  );
};

export default LoginPage;
