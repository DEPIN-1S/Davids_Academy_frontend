import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    IconButton,
    Checkbox,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchStudentTopics } from '../../features/exam/examAPI';

const CreateTestComponent = ({ handleClose }) => {
    const navigate = useNavigate();
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [liveTopics, setLiveTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(false);

    useEffect(() => {
        const loadTopics = async () => {
            setLoadingTopics(true);
            try {
                const data = await fetchStudentTopics();
                setLiveTopics(data);
            } catch (err) {
                console.error("Failed to fetch topics", err);
            } finally {
                setLoadingTopics(false);
            }
        };
        loadTopics();
    }, []);

    const handleTopicToggle = (topic) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const handleCreateTest = () => {
        const topicsQuery = selectedTopics.join(',');
        let queryParams = `?mode=question-bank`;
        if (topicsQuery) {
            queryParams += `&topics=${topicsQuery}`;
        }
        
        console.log('Starting Test with URL:', `/student/exam${queryParams}`);
        navigate(`/student/exam${queryParams}`);
        if (handleClose) {
            handleClose();
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 650, mx: 'auto', position: 'relative', borderRadius: 4, bgcolor: 'background.paper' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Select Topics
                </Typography>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: 'text.secondary',
                        bgcolor: 'grey.50',
                        '&:hover': { bgcolor: 'grey.100', color: 'error.main', transform: 'rotate(90deg)' },
                        transition: 'all 0.3s ease'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content Area */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose the topics you want to include in your question bank session.
                </Typography>
                
                <Box
                    sx={{
                        mt: 1,
                        p: 1,
                        maxHeight: 280,
                        overflowY: 'auto',
                        px: 1,
                        /* Custom Scrollbar for modern look */
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                        '&::-webkit-scrollbar-thumb': { background: '#ccc', borderRadius: '4px', '&:hover': { background: '#aaa' } }
                    }}
                >
                    {loadingTopics ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress size={30} sx={{ color: '#f3c600' }} />
                        </Box>
                    ) : liveTopics.length === 0 ? (
                        <Box textAlign="center" py={4} bgcolor="grey.50" borderRadius={2}>
                            <Typography variant="body1" color="text.secondary">
                                No topics available for your course.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {liveTopics.map((topicItem, index) => {
                                // Support old string format or new object format
                                const topicDisplay = typeof topicItem === 'string' ? topicItem : topicItem.topic_name;
                                const topicValue = typeof topicItem === 'string' ? topicItem : topicItem.topic_id;
                                const isCompleted = typeof topicItem === 'object' && topicItem.is_completed;
                                const isSelected = selectedTopics.includes(topicValue) && !isCompleted;

                                return (
                                    <Grid item xs={12} sm={6} key={`topic-${topicValue}-${index}`}>
                                        <Paper
                                            elevation={0}
                                            onClick={() => {
                                                if (!isCompleted) handleTopicToggle(topicValue);
                                            }}
                                            sx={{
                                                p: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: isCompleted ? 'not-allowed' : 'pointer',
                                                border: '2px solid',
                                                borderColor: isCompleted ? '#4caf50' : (isSelected ? '#f3c600' : 'grey.200'),
                                                bgcolor: isCompleted ? '#e8f5e9' : (isSelected ? '#fffdf0' : 'background.paper'),
                                                borderRadius: 3,
                                                opacity: isCompleted ? 0.8 : 1,
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    borderColor: isCompleted ? '#4caf50' : (isSelected ? '#e0b400' : 'grey.300'),
                                                    transform: isCompleted ? 'none' : 'translateY(-2px)',
                                                    boxShadow: isCompleted ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox
                                                    checked={isCompleted || isSelected}
                                                    disabled={isCompleted}
                                                    disableRipple
                                                    sx={{
                                                        p: 0,
                                                        mr: 1.5,
                                                        color: isCompleted ? '#81c784' : 'grey.300',
                                                        '&.Mui-checked': { color: isCompleted ? '#4caf50' : '#f3c600' },
                                                        '&.Mui-disabled': { color: '#4caf50' }
                                                    }}
                                                />
                                                <Typography
                                                    variant="body1"
                                                    fontWeight={isSelected || isCompleted ? 600 : 500}
                                                    color={isCompleted ? '#2e7d32' : (isSelected ? 'text.primary' : 'text.secondary')}
                                                    sx={{ transition: 'color 0.2s' }}
                                                >
                                                    {topicDisplay}
                                                </Typography>
                                            </Box>
                                            {isCompleted && (
                                                <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600, bgcolor: '#c8e6c9', px: 1, py: 0.5, borderRadius: 1 }}>
                                                    Completed
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'grey.100'
            }}>
                <Button
                    variant="text"
                    onClick={handleClose}
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'grey.100', color: 'text.primary' }
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleCreateTest}
                    sx={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #F3A100 100%)',
                        color: '#000',
                        fontWeight: 700,
                        borderRadius: 2,
                        padding: '10px 28px',
                        boxShadow: '0 4px 14px rgba(243, 198, 0, 0.4)',
                        transition: 'all 0.2s',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #F3A100 0%, #FFD700 100%)',
                            boxShadow: '0 6px 20px rgba(243, 198, 0, 0.6)',
                            transform: 'translateY(-2px)'
                        },
                    }}
                >
                    Start Test &rarr;
                </Button>
            </Box>
        </Box>
    );
};

export default CreateTestComponent;
