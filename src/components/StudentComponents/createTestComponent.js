import React, { useState } from 'react';
import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    MenuItem,
    Select,
    Button,
    Grid,
    Paper,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const topics = ['Adult Health', 'Pharmacology', 'Cardiovascular'];

const CreateTestComponent = ({ handleClose }) => {
    const [mode, setMode] = useState('Tutorial');
    const [testType, setTestType] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [questionCount, setQuestionCount] = useState(160);

    const handleTopicToggle = (topic) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const handleCreateTest = () => {
        const payload = {
            mode,
            testType,
            selectedTopics,
            questionCount,
        };
        console.log('Creating Test with:', payload);
        // Trigger API or navigation here
    };

    return (
        <Box sx={{ p: 3, maxWidth: 700, mx: 'auto', position: 'relative' }}>
            {/* Close Button */}
            <IconButton
                onClick={handleClose}
                sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
            >
                <CloseIcon />
            </IconButton>

            {/* Mode */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600}>Mode</Typography>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(e, val) => val && setMode(val)}
                    sx={{ mt: 1 }}
                >
                    <ToggleButton value="Tutorial">Tutorial</ToggleButton>
                    <ToggleButton value="Timed">Timed</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Test Type */}
            <Box sx={{ mb: 3 }}>
                <FormControl>
                    <FormLabel>Test Type</FormLabel>
                    <RadioGroup
                        row
                        value={testType}
                        onChange={(e) => setTestType(e.target.value)}
                        sx={{ mt: 1 }}
                    >
                        <FormControlLabel value="Classic" control={<Radio />} label="Classic" />
                        <FormControlLabel value="NGN" control={<Radio />} label="NGN" />
                        <FormControlLabel value="Mixed" control={<Radio />} label="Mixed" />
                    </RadioGroup>
                </FormControl>
            </Box>

            {/* Select Topics */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600}>Select Topics</Typography>
                <Paper elevation={1} sx={{ mt: 1, p: 2, maxHeight: 180, overflowY: 'auto' }}>
                    <Grid container spacing={2}>
                        {topics.map((topic, index) => (
                            <Grid item xs={4} key={`${topic}-${index}`}>
                                <FormControlLabel
                                    control={
                                        <Radio
                                            checked={selectedTopics.includes(topic)}
                                            onClick={() => handleTopicToggle(topic)}
                                        />
                                    }
                                    label={topic}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>

            {/* Question Count */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600}>Question Count</Typography>
                <Select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    sx={{ mt: 1, width: 100 }}
                >
                    {[40, 80, 100, 120, 160].map((count) => (
                        <MenuItem key={count} value={count}>
                            {count}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                {/* Cancel Button */}
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
                        px: 3,
                    }}
                >
                    Cancel
                </Button>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#f3c600',
                        color: '#000',
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 3,
                        '&:hover': { backgroundColor: '#e0b400' },
                    }}
                    onClick={handleCreateTest}
                >
                    Create Test &rarr;
                </Button>
            </Box>
        </Box>
    );
};

export default CreateTestComponent;
