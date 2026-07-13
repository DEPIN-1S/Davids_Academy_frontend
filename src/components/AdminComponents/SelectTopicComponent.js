import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Button,
    useMediaQuery,
    TextField,
    CircularProgress,
    Stack
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SelectTopicComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:600px)");
    
    // Extract cs_id from previous step
    const cs_id = location.state?.cs_id;
    
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState("");
    
    // Inline topic creation state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTopicName, setNewTopicName] = useState("");
    const [creatingTopic, setCreatingTopic] = useState(false);
    
    // Topic deletion state
    const [deletingTopic, setDeletingTopic] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const fetchTopics = useCallback(async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/topic/list?course_id=${cs_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setTopics(result.topics || []);
            } else {
                toast.error(result.message || "Failed to fetch topics");
            }
        } catch (error) {
            console.error("Error fetching topics:", error);
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    }, [cs_id]);

    useEffect(() => {
        if (!cs_id) {
            navigate("/admin/selectCourse");
            return;
        }
        fetchTopics();
    }, [cs_id, navigate, fetchTopics]);

    const handleCreateTopic = async () => {
        if (!newTopicName.trim()) {
            toast.warning("Topic name cannot be empty");
            return;
        }
        setCreatingTopic(true);
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/topic/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    course_id: cs_id,
                    topic_name: newTopicName.trim()
                })
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Topic created successfully");
                setNewTopicName("");
                setShowCreateForm(false);
                if (result.insertId) {
                    setSelectedTopic(result.insertId); // Auto-select new topic
                }
                fetchTopics(); // Refresh list
            } else {
                toast.error(result.message || "Failed to create topic");
            }
        } catch (error) {
            console.error("Error creating topic:", error);
            toast.error("Error connecting to server");
        } finally {
            setCreatingTopic(false);
        }
    };

    const handleDeleteTopic = async () => {
        if (!selectedTopic) return;
        setDeletingTopic(true);
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/topic/delete?topic_id=${selectedTopic}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Topic deleted successfully");
                setSelectedTopic("");
                fetchTopics(); // Refresh list
            } else {
                toast.error(result.message || "Failed to delete topic");
            }
        } catch (error) {
            console.error("Error deleting topic:", error);
            toast.error("Error connecting to server");
        } finally {
            setDeletingTopic(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleNextClick = () => {
        if (!selectedTopic) return;
        navigate("/admin/exam-type", {
            state: { 
                cs_id: cs_id,
                topic_id: selectedTopic
            }
        });
    };

    const handleBackClick = () => {
        navigate("/admin/selectCourse");
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: "auto",
                px: 2,
                py: 4,
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            <ToastContainer />
            
            {/* Breadcrumb */}
            <Typography variant="subtitle2" color="text.secondary">
                Course &nbsp;&gt;&nbsp; Topic
            </Typography>

            {/* Title */}
            <Typography variant="h5" fontWeight={600}>
                Select Topic
            </Typography>

            {/* Subtitle */}
            <Typography color="text.secondary">
                Choose an existing topic or create a new one for this course.
            </Typography>

            {/* Dropdown */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box display="flex" alignItems="center" gap={1}>
                    <FormControl fullWidth>
                        <Select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            displayEmpty
                            sx={{
                                borderRadius: 2,
                                fontWeight: 500,
                                bgcolor: "#f9f9f9",
                                "& .MuiSelect-select": { padding: 2 },
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select Topic
                            </MenuItem>
                            {topics.map((topic) => (
                                <MenuItem key={topic.topic_id} value={topic.topic_id}>
                                    {topic.topic_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedTopic && (
                        <IconButton 
                            color="error" 
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={deletingTopic}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Box>
            )}

            {/* Inline Topic Creation */}
            <Box mt={1}>
                {!showCreateForm ? (
                    <Button 
                        startIcon={<AddIcon />} 
                        onClick={() => setShowCreateForm(true)}
                        sx={{ color: '#0066cc' }}
                    >
                        Create New Topic
                    </Button>
                ) : (
                    <Box sx={{ p: 2, bgcolor: '#f0f7ff', borderRadius: 2, border: '1px dashed #0066cc' }}>
                        <Typography variant="subtitle2" mb={1} color="primary">Add New Topic</Typography>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                            <TextField 
                                fullWidth 
                                size="small" 
                                placeholder="Enter topic name..." 
                                value={newTopicName}
                                onChange={(e) => setNewTopicName(e.target.value)}
                                disabled={creatingTopic}
                                sx={{ bgcolor: 'white' }}
                            />
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleCreateTopic}
                                disabled={creatingTopic || !newTopicName.trim()}
                                sx={{ minWidth: isMobile ? '100%' : '120px' }}
                            >
                                {creatingTopic ? <CircularProgress size={24} color="inherit" /> : 'Save Topic'}
                            </Button>
                            <Button 
                                variant="text" 
                                color="error" 
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setNewTopicName("");
                                }}
                                disabled={creatingTopic}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Box>

            {/* Navigation Buttons */}
            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    fullWidth={isMobile}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNextClick}
                    disabled={!selectedTopic}
                    sx={{ backgroundColor: "#FFD700", color: "#000" }}
                    fullWidth={isMobile}
                >
                    Next
                </Button>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Topic</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this topic? Any questions associated with this topic may be affected.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTopic} color="error" disabled={deletingTopic}>
                        {deletingTopic ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SelectTopicComponent;
