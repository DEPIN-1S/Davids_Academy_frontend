import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Container,
    useTheme,
    useMediaQuery,
    IconButton,
    Stack,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon
} from '@mui/icons-material';

const CourseManagement = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [courses] = useState([
        {
            id: 1,
            title: 'Prometric Coaching',
            description: 'Prometric exams open doors for healthcare careers in Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait.',
            overview: 'This comprehensive program is designed to help nursing professionals succeed in the NCLEX-RN examination. Our expert-led training focuses on real-world questions, self-advanced study methods, and....',
            status: 'active'
        },
        {
            id: 2,
            title: 'Prometric Coaching',
            description: 'Prometric exams open doors for healthcare careers in Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait.',
            overview: 'This comprehensive program is designed to help nursing professionals succeed in the NCLEX-RN examination. Our expert-led training focuses on real-world questions, self-advanced study methods, and....',
            status: 'active'
        },
        {
            id: 3,
            title: 'Prometric Coaching',
            description: 'Prometric exams open doors for healthcare careers in Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait.',
            overview: 'This comprehensive program is designed to help nursing professionals succeed in the NCLEX-RN examination. Our expert-led training focuses on real-world questions, self-advanced study methods, and....',
            status: 'active'
        },
        {
            id: 4,
            title: 'Prometric Coaching',
            description: 'Prometric exams open doors for healthcare careers in Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait.',
            overview: 'This comprehensive program is designed to help nursing professionals succeed in the NCLEX-RN examination. Our expert-led training focuses on real-world questions, self-advanced study methods, and....',
            status: 'active'
        }
    ]);

    const handleAddCourse = () => {
        console.log('Add new course');
    };

    const handleEditCourse = (courseId) => {
        console.log('Edit course:', courseId);
    };

    const handleDeleteCourse = (courseId) => {
        console.log('Delete course:', courseId);
    };

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    mb: { xs: 2, sm: 3, md: 4 },
                    gap: { xs: 2, sm: 0 }
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                        color: 'text.primary',
                        mb: { xs: 1, sm: 0 }
                    }}
                >
                    Available Courses
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCourse}
                    sx={{
                        bgcolor: '#F5C842',
                        color: 'black',
                        fontWeight: 600,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.5 },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        minWidth: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                            bgcolor: '#E6B53C',
                        }
                    }}
                >
                    Add Course
                </Button>
            </Box>

            {/* Courses Grid */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                {courses.map((course) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={6}
                        xl={6}
                        key={course.id}
                    >
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                border: '1px solid',
                                borderColor: 'grey.200',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent
                                sx={{
                                    flexGrow: 1,
                                    p: { xs: 2, sm: 3 },
                                    pb: { xs: 1, sm: 2 }
                                }}
                            >
                                {/* Course Title with Icon */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: { xs: 1.5, sm: 2 },
                                        gap: 1
                                    }}
                                >
                                    <SchoolIcon
                                        sx={{
                                            color: 'primary.main',
                                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            color: 'text.primary',
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {course.title}
                                    </Typography>
                                </Box>

                                {/* Course Description */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        mb: { xs: 1.5, sm: 2 },
                                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                        lineHeight: 1.5
                                    }}
                                >
                                    {course.description}
                                </Typography>

                                {/* Course Overview Section */}
                                <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 1,
                                            color: 'text.primary',
                                            fontSize: { xs: '0.9rem', sm: '1rem' }
                                        }}
                                    >
                                        Course Overview
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {course.overview}
                                    </Typography>
                                </Box>

                                {/* Status Chip */}
                                <Chip
                                    label="Active"
                                    size="small"
                                    sx={{
                                        bgcolor: 'success.light',
                                        color: 'success.dark',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                                    }}
                                />
                            </CardContent>

                            {/* Action Buttons */}
                            <CardActions
                                sx={{
                                    justifyContent: 'flex-end',
                                    p: { xs: 2, sm: 3 },
                                    pt: 0,
                                    gap: 1
                                }}
                            >
                                {isMobile ? (
                                    // Mobile: Icon buttons only
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            onClick={() => handleEditCourse(course.id)}
                                            sx={{
                                                color: 'primary.main',
                                                bgcolor: 'primary.light',
                                                '&:hover': {
                                                    bgcolor: 'primary.main',
                                                    color: 'white'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteCourse(course.id)}
                                            sx={{
                                                color: 'error.main',
                                                bgcolor: 'error.light',
                                                '&:hover': {
                                                    bgcolor: 'error.main',
                                                    color: 'white'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ) : (
                                    // Desktop/Tablet: Text buttons with icons
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditCourse(course.id)}
                                            size={isTablet ? "small" : "medium"}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                borderRadius: 2,
                                                px: { sm: 1.5, md: 2 }
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteCourse(course.id)}
                                            size={isTablet ? "small" : "medium"}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                borderRadius: 2,
                                                px: { sm: 1.5, md: 2 }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Empty State (if no courses) */}
            {courses.length === 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 300,
                        textAlign: 'center',
                        gap: 2
                    }}
                >
                    <SchoolIcon
                        sx={{
                            fontSize: { xs: 48, sm: 64 },
                            color: 'text.disabled'
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                    >
                        No courses available
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.disabled',
                            maxWidth: 400,
                            px: 2
                        }}
                    >
                        Get started by adding your first course to the system.
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default CourseManagement;
