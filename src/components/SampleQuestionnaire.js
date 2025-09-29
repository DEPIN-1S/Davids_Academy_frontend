import React, { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ContactForm from "../components/ContactForm"; // Adjust path

const SampleQuestionnaire = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container
      disableGutters
      sx={{
        py: { xs: 7, md: 10 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "1510px",
          width: "100%",
          borderRadius: "24px",
          bgcolor: "#FAFAFA",
          background: "linear-gradient(90deg, #fff, #fff6e5)",
          textAlign: "center",
          p: { xs: 4, md: 8 },
          boxShadow: "0px 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.8rem", md: "2rem" },
          }}
        >
          Try Our Sample Questionnaire
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          paragraph
          sx={{
            color: "text.secondary",
            maxWidth: "700px",
            mx: "auto",
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          Practice with real-world sample questions covering nursing entrance
          exams, international certifications, and competitive tests. See how our
          training helps you master them with confidence.
        </Typography>

        {/* Button */}
        <Button
          onClick={handleOpen}
          sx={{
            mt: 3,
            px: 4,
            py: 1.5,
            borderRadius: "12px",
            border: "1.5px solid #000",
            fontSize: "1rem",
            fontWeight: 500,
            color: "#000",
            background: "transparent",
            textTransform: "none",
            "&:hover": {
              background: "#f7f7f7",
            },
          }}
        >
          Explore Sample Questions →
        </Button>
      </Box>

      <ContactForm open={open} onClose={handleClose} />
    </Container>
  );
};

export default SampleQuestionnaire;
