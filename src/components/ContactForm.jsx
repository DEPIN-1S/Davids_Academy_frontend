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
    if (!contactFormData.email.trim()) newErrors.email = "Email is required.";
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
        onClose(); // Close dialog
        // FIX: Navigate to sample exam to load questions
        navigate("/exam?mode=sample"); // Adjust to your route (e.g., /student/exam?mode=sample if auth needed)
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "#ffffff",
          boxShadow: "0 15px 35px rgba(47, 59, 108, 0.15)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
          maxHeight: "95vh",
          height: "auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          m: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #2F3B6C, #3f51b5, #2F3B6C)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#2F3B6C",
          fontWeight: 700,
          fontSize: "1.5rem",
          pt: 3,
          pb: 2,
          px: 3,
          textAlign: "center",
          flexShrink: 0,
          background: "linear-gradient(135deg, #2F3B6C 0%, #3f51b5 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Get in Touch
      </DialogTitle>
      <DialogContent
        sx={{
          px: 3,
          py: 2,
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <TextField
          label="Full Name"
          name="name"
          value={contactFormData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.1)",
                borderColor: "#2F3B6C",
              },
              "&.Mui-focused": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.2)",
                borderColor: "#2F3B6C",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#666",
              fontSize: "0.9rem",
              "&.Mui-focused": {
                color: "#2F3B6C",
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
              marginTop: "2px",
            },
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={contactFormData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.1)",
                borderColor: "#2F3B6C",
              },
              "&.Mui-focused": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.2)",
                borderColor: "#2F3B6C",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#666",
              fontSize: "0.9rem",
              "&.Mui-focused": {
                color: "#2F3B6C",
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
              marginTop: "2px",
            },
          }}
        />
        <TextField
          label="Phone Number"
          name="phone"
          value={contactFormData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.1)",
                borderColor: "#2F3B6C",
              },
              "&.Mui-focused": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.2)",
                borderColor: "#2F3B6C",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#666",
              fontSize: "0.9rem",
              "&.Mui-focused": {
                color: "#2F3B6C",
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
              marginTop: "2px",
            },
          }}
        />
        <FormControl
          fullWidth
          size="small"
          error={!!errors.course_interested}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.1)",
                borderColor: "#2F3B6C",
              },
              "&.Mui-focused": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.2)",
                borderColor: "#2F3B6C",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#666",
              fontSize: "0.9rem",
              "&.Mui-focused": {
                color: "#2F3B6C",
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
              marginTop: "2px",
            },
          }}
        >
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
          rows={3}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.1)",
                borderColor: "#2F3B6C",
              },
              "&.Mui-focused": {
                boxShadow: "0 2px 8px rgba(47, 59, 108, 0.2)",
                borderColor: "#2F3B6C",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#666",
              fontSize: "0.9rem",
              "&.Mui-focused": {
                color: "#2F3B6C",
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
              marginTop: "2px",
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          justifyContent: "center",
          gap: 2,
          flexShrink: 0,
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            borderColor: "#e0e0e0",
            color: "#666",
            textTransform: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
            minWidth: 100,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#2F3B6C",
              color: "#2F3B6C",
              backgroundColor: "rgba(47, 59, 108, 0.05)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={sendContactMessage}
          variant="contained"
          disabled={submitLoading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            bgcolor: "#2F3B6C",
            textTransform: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            minWidth: 120,
            boxShadow: "0 2px 8px rgba(47, 59, 108, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#1e2a4a",
              boxShadow: "0 4px 12px rgba(47, 59, 108, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0px)",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              boxShadow: "none",
            },
          }}
        >
          {submitLoading ? "Sending..." : "Send Message"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactForm;
