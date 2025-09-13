import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitContact } from "../features/contact/contactSlice"; // Adjust path
import { fetchCourses } from "../features/courses/courseSlice"; // Adjust path
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

const ContactForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submitLoading } = useSelector((state) => state.contact);
  const { list: courses } = useSelector((state) => state.course);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course_interested: "", // usually ID, can be number or string
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

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

    // FIX: don't use trim() here, course_interested might be a number
    if (
      contactFormData.course_interested === "" ||
      contactFormData.course_interested === null ||
      contactFormData.course_interested === undefined
    ) {
      newErrors.course_interested = "Please select a course.";
    }

    if (!contactFormData.message.trim()) newErrors.message = "Message is required.";

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
        onClose(); // Close dialog
        // FIX: Navigate to sample exam to load questions
        navigate("/exam?mode=sample");  // Adjust to your route (e.g., /student/exam?mode=sample if auth needed)
      } else if (action.type.endsWith("rejected")) {
        alert("Failed to send message. Please try again later.");
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactFormData({ ...contactFormData, [name]: value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Contact Us</DialogTitle>
      <DialogContent>
        <TextField
          label="Full Name"
          name="name"
          value={contactFormData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={contactFormData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          name="phone"
          value={contactFormData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal" error={!!errors.course_interested}>
          <InputLabel>Course Interested In</InputLabel>
          <Select
            name="course_interested"
            value={contactFormData.course_interested}
            onChange={handleChange}
            label="Course Interested In"
          >
            <MenuItem value="">Select a course</MenuItem>
            {courses.map((course, index) => (
              <MenuItem key={index} value={course.cs_id}>
                {course.cs_name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.course_interested}</FormHelperText>
        </FormControl>
        <TextField
          label="Message"
          name="message"
          value={contactFormData.message}
          onChange={handleChange}
          error={!!errors.message}
          helperText={errors.message}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={sendContactMessage} variant="contained" color="primary" disabled={submitLoading}>
          {submitLoading ? "Sending..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactForm;