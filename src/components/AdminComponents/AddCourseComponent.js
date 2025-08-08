import React, { useRef, useState, useEffect } from 'react';
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
    Chip,
    Grid,
    Stack
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    Image as ImageIcon,
    PictureAsPdf,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse, resetCourseStatus } from '../../features/courses/courseSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCourseComponent = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Form state
    const [form, setForm] = useState({
        course_name: '',
        sub_title: '',
        description: '',
    });
    const [highlights, setHighlights] = useState(['']);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef();

    // Redux feedback
    const { createLoading, createSuccess, createError } = useSelector(state => state.course);

    // Toast feedback (+ reset form on success)
    // Toast and redirect on success, Toast on error
    useEffect(() => {
        if (createSuccess) {
            toast.success('Course added successfully!');
            setForm({ course_name: '', sub_title: '', description: '' });
            setHighlights(['']);
            setFile(null);
            setErrors({});
            dispatch(resetCourseStatus());
            // Redirect after short delay for user to see toast (1s)
            setTimeout(() => navigate('/admin/course-management'), 1000);
        }
        if (createError) {
            toast.error(typeof createError === 'string' ? createError : 'Failed to add course!');
            dispatch(resetCourseStatus());
        }
    }, [createSuccess, createError, dispatch, navigate]);

    // Input handlers
    const handleInputChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
        setErrors(prev => ({ ...prev, [field]: null }));
    };
    // Highlights handlers
    const handleHighlightChange = (idx, val) => {
        const updated = [...highlights];
        updated[idx] = val;
        setHighlights(updated);
    };
    const addHighlight = () => setHighlights([...highlights, '']);
    const removeHighlight = idx => highlights.length > 1 && setHighlights(highlights.filter((_, i) => i !== idx));

    // File handling
    const handleFileSelect = (e) => {
        const fileVal = e.target.files[0];
        if (fileVal) {
            if (fileVal.size > 10 * 1024 * 1024)
                return setErrors(prev => ({ ...prev, file: 'File size must be < 10MB' }));
            if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(fileVal.type))
                return setErrors(prev => ({ ...prev, file: 'Only image or pdf allowed.' }));
            setFile(fileVal);
            setErrors(prev => ({ ...prev, file: null }));
        }
        e.target.value = '';
    };
    const handleRemoveFile = () => setFile(null);

    // Form validation
    const validate = () => {
        const e = {};
        if (!form.course_name.trim()) e.course_name = 'Title is required';
        if (!form.sub_title.trim()) e.sub_title = 'Subtitle is required';
        if (!form.description.trim()) e.description = 'Description is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Form Submit: Compose FormData and dispatch thunk
    const handleSave = () => {
        if (!validate()) return;
        const fd = new FormData();
        fd.append('course_name', form.course_name);
        fd.append('sub_title', form.sub_title);
        fd.append('descrption', form.description);
        fd.append('desc_points', highlights.filter(h => h.trim()).join(','));
        if (file) fd.append('courseimage', file);
        dispatch(createCourse(fd));
    };


    const handleCancel = () => navigate(-1);

    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return <ImageIcon />;
        if (fileType === 'application/pdf') return <PictureAsPdf />;
        return null;
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Toast container sits outside UI */}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} mb={1} textAlign={isMobile ? 'center' : 'left'}>
                    Add New Course
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                    Fill in the details to create and publish a new course.
                </Typography>
            </Box>

            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Grid container spacing={3}>

                        {/* Title */}
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} mb={1.5}>Course Title</Typography>
                            <TextField
                                fullWidth
                                value={form.course_name}
                                onChange={handleInputChange('course_name')}
                                placeholder="NCLEX-RN Preparation"
                                error={!!errors.course_name} helperText={errors.course_name}
                            />
                        </Grid>

                        {/* Subtitle */}
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} mb={1.5}>Course Subtitle</Typography>
                            <TextField
                                fullWidth
                                value={form.sub_title}
                                onChange={handleInputChange('sub_title')}
                                placeholder="Brief summary of course"
                                error={!!errors.sub_title} helperText={errors.sub_title}
                            />
                        </Grid>

                        {/* Description / Overview */}
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} mb={1.5}>Course Description</Typography>
                            <TextField
                                fullWidth multiline minRows={4} value={form.description}
                                onChange={handleInputChange('description')}
                                placeholder="Full course overview"
                                error={!!errors.description} helperText={errors.description}
                            />
                        </Grid>

                        {/* Highlights */}
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} mb={1.5}>✓ Add Highlights</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>Highlights the goals, comma separated</Typography>
                            {highlights.map((h, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Chip label={idx + 1} color="primary" size="small" />
                                    <TextField
                                        fullWidth
                                        placeholder="e.g. Expert mentors"
                                        value={h}
                                        onChange={e => handleHighlightChange(idx, e.target.value)}
                                        size="small"
                                    />
                                    {highlights.length > 1 && (
                                        <IconButton onClick={() => removeHighlight(idx)} size="small" sx={{ color: 'error.main' }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            <Button
                                onClick={addHighlight}
                                variant="outlined"
                                size="small"
                                sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.9rem' }}
                            >
                                + Add More Highlight
                            </Button>
                        </Grid>

                        {/* File Upload */}
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                sx={{ textTransform: 'none', borderRadius: 2, mb: 2 }}
                            >
                                Upload Course Image or PDF
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*,.pdf"
                                style={{ display: 'none' }}
                            />
                            {errors.file && (
                                <Box sx={{ mt: 1, color: "error.main", fontSize: "0.95rem" }}>{errors.file}</Box>
                            )}
                            {file && (
                                <Card sx={{ mt: 2, border: '1px solid', borderColor: 'grey.200' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            {getFileIcon(file.type)}
                                            <Box flex={1}>
                                                <Typography variant="body2" fontWeight={500}>{file.name}</Typography>
                                                <Stack direction="row" spacing={1} mt={0.5}>
                                                    <Chip
                                                        label={Math.ceil(file.size / 1024) + " KB"}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Stack>
                                            </Box>
                                            {file.type.startsWith('image/') &&
                                                <Box component="img" src={URL.createObjectURL(file)} alt={file.name}
                                                    sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }} />}
                                            <IconButton onClick={handleRemoveFile} color="error" size="small">
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
            <Box sx={{
                mt: { xs: 3, sm: 4 },
                display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'stretch', sm: 'space-between' }
            }}>
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
                    disabled={createLoading}
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
                        '&:hover': { bgcolor: '#E6B53C' }
                    }}
                    disabled={createLoading}
                >
                    {createLoading ? "Saving..." : "Save"}
                </Button>
            </Box>

            {/* Toast feedback is now handled above by react-toastify */}
        </Container>
    );
};

export default AddCourseComponent;
