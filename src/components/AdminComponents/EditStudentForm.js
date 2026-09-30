import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, TextField, Card, CardContent, Grid, FormControl, Select, MenuItem,
    InputAdornment
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/courseSlice';
import { updateStudent } from '../../features/students/studentSlice';

const EditStudentForm = ({ studentId, onClose }) => {
    const dispatch = useDispatch();
    const { list: courses } = useSelector((state) => state.course);
    const { list: students } = useSelector((state) => state.students);

    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        targetExam: '',
    });

    useEffect(() => {
        dispatch(fetchCourses());
        if (studentId) {
            const student = students.find(s => s.id === studentId);
            if (student) {
                setFormData({
                    fullName: student.firstname,
                    emailAddress: student.email,
                    phoneNumber: student.mobile,
                    targetExam: student.target_exam,
                    password: student.password,
                    status: student.status,
                    role: student.role,
                    id: student.id
                });
            }
        }
    }, [dispatch, studentId, students]);


    const [errors, setErrors] = useState({});

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';

        if (!formData.emailAddress.trim()) {
            newErrors.emailAddress = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
            newErrors.emailAddress = 'Please enter a valid email address';
        }

        const digitsOnly = formData.phoneNumber.replace(/\D/g, '');
        if (!digitsOnly) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{7,15}$/.test(digitsOnly)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            student_id: studentId,
            fullname: formData.fullName,
            email: formData.emailAddress,
            phone: formData.phoneNumber,
            target_exam: formData.targetExam,
        };

        dispatch(updateStudent(payload))
            .unwrap()
            .then(() => {
                alert("✅ Student updated successfully!");
                onClose?.();
            })
            .catch((error) => {
                alert(`❌ Error updating student: ${error.message || error}`);
            });
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.5)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2
            }}
        >
            <Box
                sx={{
                    width: { xs: "95%", sm: "450px", md: "500px" },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "white",
                    borderRadius: 3,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                    p: 3
                }}
            >
                <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
                    <CardContent>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" fontWeight={600}>
                                Edit Student
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Fill in the student's details to update their account.
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography fontWeight={600}>Full Name*</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange('fullName')}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography fontWeight={600}>Email Address*</Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.emailAddress}
                                    onChange={handleInputChange('emailAddress')}
                                    error={!!errors.emailAddress}
                                    helperText={errors.emailAddress}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography fontWeight={600}>Phone Number*</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange('phoneNumber')}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                +91
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography fontWeight={600}>Target Exam*</Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={formData.targetExam}
                                        onChange={handleInputChange('targetExam')}
                                        displayEmpty
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SchoolIcon />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="" disabled>Select Course</MenuItem>

                                        {courses.map((course, i) => (
                                            <MenuItem key={i} value={course.cs_id}>
                                                {course.cs_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        endIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{ bgcolor: "#F5C842", color: "black", borderRadius: 2 }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default EditStudentForm;
