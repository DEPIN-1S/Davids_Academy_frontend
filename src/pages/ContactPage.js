import React, { useState } from "react";
import "../styles/ContactPage.css";
import { submitContact } from "../features/contact/contactSlice";
import { useDispatch, useSelector } from "react-redux";

const ContactPage = () => {
  const dispatch = useDispatch();
  const { submitLoading, submitSuccess, submitError } = useSelector(
    (state) => state.contact
  );

  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course_interested: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!contactFormData.name.trim()) newErrors.name = "Full name is required.";
    if (!contactFormData.email.trim())
      newErrors.email = "Email is required.";
    else if (!emailPattern.test(contactFormData.email))
      newErrors.email = "Invalid email format.";
    if (!contactFormData.phone.trim())
      newErrors.phone = "Phone number is required.";
    else if (!phonePattern.test(contactFormData.phone))
      newErrors.phone = "Phone must be 10 digits.";
    if (!contactFormData.course_interested.trim())
      newErrors.course_interested = "Please select a course.";
    if (!contactFormData.message.trim())
      newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendContactMessage = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(submitContact(contactFormData)).then((action) => {
      if (action.type.endsWith("fulfilled")) {
        alert("Message sent successfully!");
        setContactFormData({
          name: "",
          email: "",
          phone: "",
          course_interested: "",
          message: "",
        });
        setErrors({});
      } else if (action.type.endsWith("rejected")) {
        alert("Failed to send message. Please try again later.");
      }
    });


  };

  return (
    <section className="contact-form-section">
      <div className="contact-form-container">
        <h2>Have Questions? Get in Touch!</h2>
        <p>
          Our team is ready to help you choose the right course and start your
          healthcare career journey
        </p>

        <form className="contact-form" onSubmit={sendContactMessage}>
          {/* Full Name */}
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your full name"
            value={contactFormData.name}
            onChange={(e) =>
              setContactFormData({
                ...contactFormData,
                name: e.target.value,
              })
            }
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* Email */}
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Your Email"
            value={contactFormData.email}
            onChange={(e) =>
              setContactFormData({
                ...contactFormData,
                email: e.target.value,
              })
            }
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* Phone */}
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Your phone number"
            value={contactFormData.phone}
            onChange={(e) =>
              setContactFormData({
                ...contactFormData,
                phone: e.target.value,
              })
            }
            className={errors.phone ? "error-input" : ""}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          {/* Course */}
          <label htmlFor="course_interested">Course Interested In</label>
          <select
            id="course_interested"
            name="course_interested"
            value={contactFormData.course_interested}
            onChange={(e) =>
              setContactFormData({
                ...contactFormData,
                course_interested: e.target.value,
              })
            }
            className={errors.course_interested ? "error-input" : ""}
          >
            <option value="">Select a course</option>
            <option value="NCLEX">NCLEX</option>
            <option value="prometric">PROMETRIC</option>
            <option value="cgfns">CGFNS</option>
            <option value="ielts">IELTS</option>
          </select>
          {errors.course_interested && (
            <p className="error-text">{errors.course_interested}</p>
          )}

          {/* Message */}
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Your questions or notes..."
            value={contactFormData.message}
            onChange={(e) =>
              setContactFormData({
                ...contactFormData,
                message: e.target.value,
              })
            }
            className={errors.message ? "error-input" : ""}
          ></textarea>
          {errors.message && <p className="error-text">{errors.message}</p>}

          <button type="submit" disabled={submitLoading}>
            {submitLoading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>

      <img
        className="background-wave"
        src="/images/wave.svg"
        alt="Background wave"
      />
    </section>
  );
};

export default ContactPage;
