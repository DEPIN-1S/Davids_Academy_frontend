import React, { useState } from "react";
import { Button, Radio, RadioGroup, FormControlLabel, Typography, Box } from "@mui/material";

const TestCreateComponent = ({ onBack, onNext }) => {
    const [selected, setSelected] = useState("classic");

    const handleNextClick = () => {
        onNext(selected);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Choose whether you want to build a Classic Test or an NGN Scenario-Based Assessment.
            </Typography>

            <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
                <FormControlLabel value="classic" control={<Radio />} label="Classic Question" />
                <FormControlLabel value="ngn" control={<Radio />} label="NGN Case Scenario" />
            </RadioGroup>

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button onClick={onBack}>Back</Button>
                <Button variant="contained" color="primary" onClick={handleNextClick}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default TestCreateComponent;
