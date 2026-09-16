import React, { useEffect, useState } from 'react';
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
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses, removeCourse } from '../../features/courses/courseSlice';
import '../../styles/AdminStyles/CourseManage.css';

const CourseManagementComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux selectors
    const {
        list: courses,
        loading,
        error,
        deleteLoading,
        deleteError
    } = useSelector((state) => state.course);

    // Local state for optimistically hiding courses being deleted
    const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    // If all deletion is done (deleteLoading false), clear the pending list
    // If you have deleteSuccess in your slice, you can use that too
    useEffect(() => {
        if (!deleteLoading && pendingDeleteIds.length > 0) {
            setPendingDeleteIds([]);

        }
        // Optionally, handle rollback on deleteError!
    }, [deleteLoading, pendingDeleteIds.length]);

    const handleAddCourse = () => {
        navigate('/admin/course-form');
    };

    const handleEditCourse = (courseId) => {
        navigate(`/admin/course-form/${courseId}`);
    };

    const handleDeleteCourse = (courseId) => {
        const confirmed = window.confirm("Are you sure you want to delete this course?");
        if (confirmed) {
            setPendingDeleteIds((prev) => [...prev, courseId]);

            dispatch(removeCourse(courseId))
                .unwrap()
                .then(() => {
                    alert("Course deleted successfully");
                    dispatch(fetchCourses());
                })
                .catch((error) => {
                    alert("Failed to delete course: ");
                });
        }
    };


    // Display all courses except those being deleted right now
    const displayCourses = (courses || []).filter(
        (course) => !pendingDeleteIds.includes(course.cs_id)
    );


    return (
        <Container maxWidth="xl" className="course-manage-futuristic" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header Section */}
            <Box className="course-manage-header">
                <Typography
                    variant="h4"
                    component="h4"
                    className="course-manage-title"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                        mb: { xs: 1, sm: 0 }
                    }}
                >
                    Available Courses
                    <span className="course-count">{displayCourses.length}</span>
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCourse}
                    className="add-course-btn"
                    sx={{ textTransform: 'none' }}
                >
                    Add Course
                </Button>
            </Box>

            {/* Delete feedback */}
            {deleteLoading && (
                <Typography
                    variant="body2"
                    color="warning.main"
                    sx={{ mt: 2, mb: 1, textAlign: 'center' }}
                >
                    Deleting course...
                </Typography>
            )}
            {deleteError && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{ mb: 2, textAlign: 'center' }}
                >
                    Error deleting course: {deleteError}
                </Typography>
            )}

            {/* Loading */}
            {loading && (
                <Box textAlign="center" sx={{ mt: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" mt={2}>
                        Loading courses...
                    </Typography>
                </Box>
            )}

            {/* Error */}
            {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {/* No Courses */}
            {!loading && !error && displayCourses.length === 0 && (
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

            {/* Course Cards */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                {displayCourses.map((course, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        key={course.cs_id}
                        style={{ animationDelay: `${index * 0.06}s` }}
                        className="course-card-wrap"
                    >
                        <Card
                            className="course-glass-card"
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <CardContent
                                sx={{
                                    flexGrow: 1,
                                    p: { xs: 2, sm: 7 },
                                    pb: { xs: 1, sm: 2 }
                                }}
                            >
                                {/* Course Title with Icon */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, sm: 2 }, gap: 1 }}>
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
                                        {course.cs_name}
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
                                    {course.cs_description}
                                </Typography>

                                {/* Course Overview */}
                                <Box sx={{ mb: { xs: 1.5, sm: 1.7 } }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 600,
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
                                            lineHeight: 1.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {course.cs_sub_title}
                                    </Typography>
                                </Box>

                                {/* Course Highlights */}
                                {course.cs_desc_points && (
                                    <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                mb: 1
                                            }}
                                        >
                                            Course Highlights
                                        </Typography>
                                        <ul style={{ margin: 0, paddingLeft: '1.2em', color: '#607d8b', fontSize: '0.96em' }}>
                                            {course.cs_desc_points.split(',').map((point, idx) =>
                                                <li key={idx} style={{ marginBottom: 4 }}>
                                                    {point.trim()}
                                                </li>
                                            )}
                                        </ul>
                                    </Box>
                                )}

                                {/* Status Chip */}
                                <Chip
                                    className={`status-chip ${course.cs_status === 'inactive' ? 'is-inactive' : 'is-active'}`}
                                    label={course.cs_status ? course.cs_status.charAt(0).toUpperCase() + course.cs_status.slice(1) : "Active"}
                                    size="medium"
                                />
                            </CardContent>

                            <CardActions
                                sx={{
                                    justifyContent: 'flex-end',
                                    p: { xs: 2, sm: 3 },
                                    pt: 0,
                                    gap: 1
                                }}
                            >
                                {isMobile ? (
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            onClick={() => handleEditCourse(course.cs_id)}
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
                                            onClick={() => handleDeleteCourse(course.cs_id)}
                                            sx={{
                                                color: 'error.main',
                                                bgcolor: 'error.light',
                                                '&:hover': {
                                                    bgcolor: 'error.main',
                                                    color: 'white'
                                                }
                                            }}
                                            size="small"
                                            disabled={deleteLoading}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            className="course-edit-btn"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditCourse(course.cs_id)}
                                            size={isTablet ? "small" : "medium"}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            className="course-delete-btn"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteCourse(course.cs_id)}
                                            size={isTablet ? "small" : "medium"}
                                            sx={{ textTransform: 'none' }}
                                            disabled={deleteLoading}
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
        </Container>
    );
};

export default CourseManagementComponent;
