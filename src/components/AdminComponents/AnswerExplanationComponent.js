import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AnswerExplanation = ({ onBack, onNext }) => {
    const [explanation, setExplanation] = useState("");

    const handleNext = () => {
        onNext({ explanation });
    };

    return (
        <Box p={3}>
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary" mb={1}>
                Test type &gt; Question Type &gt; Question Content &gt; <strong>Explanation</strong>
            </Typography>

            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Answer Explanation
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Understand why an answer is correct or incorrect to strengthen learning and critical thinking.
            </Typography>

            {/* Input */}
            <TextField
                label="Answer Explanation"
                placeholder="Understand why an answer is correct or incorrect to strengthen learning and critical thinking."
                multiline
                minRows={4}
                fullWidth
                variant="outlined"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
            />

            {/* Add Picture / Info */}
            <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddPhotoAlternateIcon />}
                    >
                        Add pictures
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<InfoOutlinedIcon />}
                    >
                        Additional Info
                    </Button>
                </Grid>
            </Grid>

            {/* Navigation */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                    disabled={!explanation.trim()}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default AnswerExplanation;
