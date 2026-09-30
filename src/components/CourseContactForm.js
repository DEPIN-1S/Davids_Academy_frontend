import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitContact, resetContactStatus } from '../features/contact/contactSlice';
import '../styles/CourseContactForm.css';

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const CourseContactForm = () => {
  const [form, setForm] = useState(initialForm);

  const dispatch = useDispatch();

  // Safe destructuring with fallbacks
  const {
    submitLoading = false,
    submitSuccess = false,
    submitError = null
  } = useSelector(state => state.contacts || {});

  // Reset form after successful submit
  useEffect(() => {
    if (submitSuccess) {
      setForm(initialForm);
      const timer = setTimeout(() => dispatch(resetContactStatus()), 2000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, dispatch]);

  // Change handler
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContact(form));
  };

  return (
    <section className="course-contact-section">
      <div className="course-contact-card">
        <h3>Have Questions? Get in Touch!</h3>
        <p>Our team is happy to help you choose the right course and start your healthcare journey.</p>

        <form className="course-contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            disabled={submitLoading}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            disabled={submitLoading}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            disabled={submitLoading}
          />
          <input
            type="text"
            placeholder="Course Interested In"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            disabled={submitLoading}
          />
          <textarea
            placeholder="Course-related query"
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            disabled={submitLoading}
          />

          <button type="submit" disabled={submitLoading || submitSuccess}>
            {submitLoading ? "Submitting..." : submitSuccess ? "Thank you!" : "Submit"}
          </button>

          {/* Feedback messages */}
          {submitError && <div className="form-error">{submitError}</div>}
          {submitSuccess && <div className="form-success">Your message has been sent!</div>}
        </form>
      </div>
    </section>
  );
};

export default CourseContactForm;
