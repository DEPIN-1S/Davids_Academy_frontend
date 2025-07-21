import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from 'react-router-dom';
const McqAnswerExplanation = ({ onNext }) => {
    const [explanation, setExplanation] = useState("");
    const navigate = useNavigate();
    const handleNextClick = () => {
        const data = {
            explanation,
        };
        navigate('/admin/meta-info');
        // onNext(data);

    };
    const onBack = () => {
        navigate('/admin/mcq-content');
    };

    return (
        <Box p={3}>
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary">
                Test type &gt; Question Type &gt; Question Content &gt; <strong>Explanation</strong>
            </Typography>
            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Answer Explanation
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Understand why an answer is correct or incorrect to strengthen learning and critical thinking.
            </Typography>

            {/* Explanation Input */}
            <TextField
                fullWidth
                multiline
                minRows={4}
                label="Answer Explanation"
                placeholder="Understand why an answer is correct or incorrect to strengthen learning and critical thinking."
                variant="outlined"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
            />

            {/* Add Image & Additional Info Buttons */}
            <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddPhotoAlternateIcon />}
                    >
                        Add Pictures
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<InfoIcon />}
                    >
                        Additional Info
                    </Button>
                </Grid>
            </Grid>

            {/* Navigation */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNextClick}
                // disabled={!explanation}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default McqAnswerExplanation;
