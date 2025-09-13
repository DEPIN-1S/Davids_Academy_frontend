import React, { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ContactForm from "../components/ContactForm"; // Adjust path

const SampleQuestionnaire = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" component="h2" gutterBottom>
          Try Our Sample Questionnaire
        </Typography>
        <Typography variant="body1" paragraph>
          Practice with real-world sample questions covering nursing entrance exams, international certifications,
          and competitive tests. See how our training helps you answer them with confidence.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Explore Sample Questions →
        </Button>
      </Box>

      <ContactForm open={open} onClose={handleClose} />
    </Container>
  );
};

export default SampleQuestionnaire;
