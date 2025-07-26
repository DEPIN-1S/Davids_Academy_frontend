import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Container,
    useTheme,
    useMediaQuery,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    InputAdornment,
    Alert
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Class as ClassIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AddStudentForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        password: '',
        targetExam: 'NCLEX',
        classType: 'Online',
        autoGeneratePassword: false
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Handle form input changes
    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData({
            ...formData,
            [field]: value
        });

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Auto-generate password if toggle is on
        if (field === 'fullName' && formData.autoGeneratePassword) {
            generatePassword(value);
        }
    };

    // Handle toggle changes
    const handleToggleChange = (field) => (event) => {
        const checked = event.target.checked;
        setFormData({
            ...formData,
            [field]: checked
        });

        if (field === 'autoGeneratePassword' && checked) {
            generatePassword(formData.fullName);
        } else if (field === 'autoGeneratePassword' && !checked) {
            setFormData(prev => ({ ...prev, password: '' }));
        }
    };

    // Generate password
    const generatePassword = (name) => {
        if (name) {
            const cleanName = name.toLowerCase().replace(/\s+/g, '');
            const randomNum = Math.floor(Math.random() * 1000);
            const generatedPassword = `${cleanName}${randomNum}`;
            setFormData(prev => ({ ...prev, password: generatedPassword }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.emailAddress.trim()) {
            newErrors.emailAddress = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
            newErrors.emailAddress = 'Please enter a valid email address';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSave = () => {
        if (validateForm()) {
            console.log('Saving student:', formData);
            // Add your save logic here
            // navigate('/admin/student-management');
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                        color: 'text.primary',
                        mb: 1,
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    Add New Student
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    Fill in the student's details to create their account and assign courses.
                </Typography>
            </Box>

            {/* Form Card */}
            <Card
                sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid',
                    borderColor: 'grey.200'
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Grid container spacing={{ xs: 3, sm: 4 }}>
                        {/* Full Name */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    color: 'text.primary'
                                }}
                            >
                                Full Name*
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter student full name"
                                value={formData.fullName}
                                onChange={handleInputChange('fullName')}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Email Address */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    color: 'text.primary'
                                }}
                            >
                                Email Address*
                            </Typography>
                            <TextField
                                fullWidth
                                type="email"
                                placeholder="Enter student email address"
                                value={formData.emailAddress}
                                onChange={handleInputChange('emailAddress')}
                                error={!!errors.emailAddress}
                                helperText={errors.emailAddress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Phone Number */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    color: 'text.primary'
                                }}
                            >
                                Phone Number*
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter student phone number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange('phoneNumber')}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <img
                                                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiByeD0iMiIgZmlsbD0iI0ZGNjYwMCIvPgo8cGF0aCBkPSJNMCA0SDIwVjEwSDBWNFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0wIDEwSDIwVjE0SDBWMTBaIiBmaWxsPSIjMDA4MDAwIi8+Cjwvc3ZnPg=="
                                                    alt="India flag"
                                                    style={{ width: 20, height: 14 }}
                                                />
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    +91
                                                </Typography>
                                            </Box>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Create Password */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    color: 'text.primary'
                                }}
                            >
                                Create Password*
                            </Typography>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password for the student"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                error={!!errors.password}
                                helperText={errors.password}
                                disabled={formData.autoGeneratePassword}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }
                                }}
                            />

                            {/* Auto-generate Password Toggle */}
                            <Box sx={{ mt: 1.5 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.autoGeneratePassword}
                                            onChange={handleToggleChange('autoGeneratePassword')}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#4CAF50',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#4CAF50',
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                color: 'text.secondary'
                                            }}
                                        >
                                            Auto-generate new password
                                        </Typography>
                                    }
                                />
                            </Box>
                        </Grid>

                        {/* Target Exam */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    color: 'text.primary'
                                }}
                            >
                                Target Exam*
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={formData.targetExam}
                                    onChange={handleInputChange('targetExam')}
                                    displayEmpty
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SchoolIcon sx={{ color: 'text.secondary', ml: 1 }} />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="NCLEX">NCLEX</MenuItem>
                                    <MenuItem value="PROMETRIC">PROMETRIC</MenuItem>
                                    <MenuItem value="CGFNS">CGFNS</MenuItem>
                                    <MenuItem value="IELTS">IELTS</MenuItem>
                                    <MenuItem value="OET">OET</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Class Type */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    color: 'text.primary'
                                }}
                            >
                                Class type
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={formData.classType}
                                    onChange={handleInputChange('classType')}
                                    displayEmpty
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <ClassIcon sx={{ color: 'text.secondary', ml: 1 }} />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="Online">Online</MenuItem>
                                    <MenuItem value="Offline">Offline</MenuItem>
                                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box
                sx={{
                    mt: { xs: 3, sm: 4 },
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { xs: 'stretch', sm: 'space-between' },
                    gap: { xs: 2, sm: 2 }
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.2, sm: 1.5 },
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        order: { xs: 2, sm: 1 },
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2
                        }
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    endIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                        bgcolor: '#F5C842',
                        color: 'black',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.2, sm: 1.5 },
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        order: { xs: 1, sm: 2 },
                        '&:hover': {
                            bgcolor: '#E6B53C',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(245, 200, 66, 0.4)'
                        }
                    }}
                >
                    Save
                </Button>
            </Box>
        </Container>
    );
};

export default AddStudentForm;
