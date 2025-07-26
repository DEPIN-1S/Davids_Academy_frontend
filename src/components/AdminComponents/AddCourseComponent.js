import React, { useState, useRef } from 'react';
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
    IconButton,
    Alert,
    Chip,
    Grid,
    Stack,
    Divider
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    Image as ImageIcon,
    PictureAsPdf,
    Description,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AddCourseComponent = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // Form state
    const [formData, setFormData] = useState({
        courseTitle: '',
        courseSubtitle: '',
        courseOverview: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [highlights, setHighlights] = useState(['']);

    const fileInputRef = useRef(null);

    // Handle form input changes
    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Handle file upload
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, file: 'Only images and PDF files are allowed' }));
                return;
            }

            const fileData = {
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString()
            };

            setSelectedFile(fileData);
            setErrors(prev => ({ ...prev, file: null }));
        }
        event.target.value = '';
    };

    const handleRemoveFile = () => {
        if (selectedFile && selectedFile.url) {
            URL.revokeObjectURL(selectedFile.url);
            setSelectedFile(null);
        }
    };

    // Handle highlights
    const handleHighlightChange = (index, value) => {
        const newHighlights = [...highlights];
        newHighlights[index] = value;
        setHighlights(newHighlights);
    };

    const addHighlight = () => {
        setHighlights([...highlights, '']);
    };

    const removeHighlight = (index) => {
        if (highlights.length > 1) {
            const newHighlights = highlights.filter((_, i) => i !== index);
            setHighlights(newHighlights);
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.courseTitle.trim()) {
            newErrors.courseTitle = 'Course title is required';
        }

        if (!formData.courseSubtitle.trim()) {
            newErrors.courseSubtitle = 'Course subtitle is required';
        }

        if (!formData.courseOverview.trim()) {
            newErrors.courseOverview = 'Course overview is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSave = () => {
        if (validateForm()) {
            const courseData = {
                ...formData,
                highlights: highlights.filter(h => h.trim()),
                file: selectedFile
            };
            console.log('Saving course:', courseData);
            // Add your save logic here
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };

    // Helper functions
    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return <ImageIcon />;
        if (fileType === 'application/pdf') return <PictureAsPdf />;
        return <Description />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    Add New Course
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    Fill in the details to create and publish a new course.
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
                        {/* Course Title */}
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                }}
                            >
                                Course Title
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter Course title..."
                                value={formData.courseTitle}
                                onChange={handleInputChange('courseTitle')}
                                error={!!errors.courseTitle}
                                helperText={errors.courseTitle}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Course Subtitle */}
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                }}
                            >
                                Course Subtitle
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                maxRows={4}
                                placeholder="Write a brief course description"
                                value={formData.courseSubtitle}
                                onChange={handleInputChange('courseSubtitle')}
                                error={!!errors.courseSubtitle}
                                helperText={errors.courseSubtitle}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Course Overview */}
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                }}
                            >
                                Now let's create Course Overview.
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={8}
                                placeholder="Write a detailed course description"
                                value={formData.courseOverview}
                                onChange={handleInputChange('courseOverview')}
                                error={!!errors.courseOverview}
                                helperText={errors.courseOverview}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Add Highlights Section */}
                        <Grid item xs={12}>
                            <Box sx={{ mb: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1.5,
                                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                    }}
                                >
                                    ✓ Add Highlights
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        mb: 2,
                                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                                    }}
                                >
                                    Highlights the goals
                                </Typography>

                                {highlights.map((highlight, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 2
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: 'success.main',
                                                flexShrink: 0
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            placeholder="Highlights the goals"
                                            value={highlight}
                                            onChange={(e) => handleHighlightChange(index, e.target.value)}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                                                }
                                            }}
                                        />
                                        {highlights.length > 1 && (
                                            <IconButton
                                                onClick={() => removeHighlight(index)}
                                                size="small"
                                                sx={{ color: 'error.main' }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}

                                <Button
                                    onClick={addHighlight}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        fontSize: { xs: '0.8rem', sm: '0.9rem' }
                                    }}
                                >
                                    + Add More Highlight
                                </Button>
                            </Box>
                        </Grid>

                        {/* File Upload Section */}
                        <Grid item xs={12}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*,.pdf"
                                style={{ display: 'none' }}
                            />


                            {/* File Error Display */}
                            {errors.file && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {errors.file}
                                </Alert>
                            )}

                            {/* Display Uploaded File */}
                            {selectedFile && (
                                <Card sx={{ mt: 2, border: '1px solid', borderColor: 'grey.200' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            {getFileIcon(selectedFile.type)}
                                            <Box flex={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {selectedFile.name}
                                                </Typography>
                                                <Stack direction="row" spacing={1} mt={0.5}>
                                                    <Chip
                                                        label={formatFileSize(selectedFile.size)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Stack>
                                            </Box>
                                            {selectedFile.type.startsWith('image/') && (
                                                <Box
                                                    component="img"
                                                    src={selectedFile.url}
                                                    alt={selectedFile.name}
                                                    sx={{
                                                        width: { xs: 50, sm: 60 },
                                                        height: { xs: 50, sm: 60 },
                                                        objectFit: 'cover',
                                                        borderRadius: 1
                                                    }}
                                                />
                                            )}
                                            <IconButton
                                                onClick={handleRemoveFile}
                                                color="error"
                                                size="small"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
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
                        order: { xs: 2, sm: 1 }
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

export default AddCourseComponent;
