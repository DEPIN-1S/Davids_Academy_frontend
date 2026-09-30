import React, { useEffect, useState } from "react";
import { fetchSampleQuestionnaireIds, fetchSampleQuestionData } from "../features/exam/examAPI"; // Adjust path
import {
   Button,
  Box,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
 
} from "@mui/material";

const SampleQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSampleQuestions = async () => {
      try {
        const ids = await fetchSampleQuestionnaireIds();
        const questionDataPromises = ids.map((item) => fetchSampleQuestionData(item.id));
        const loadedQuestions = await Promise.all(questionDataPromises);
        setQuestions(loadedQuestions);
      } catch (err) {
        setError("Failed to load sample questions. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSampleQuestions();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Sample Questionnaire
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Explore these sample questions to get a feel for our exam preparation tools. No account required!
      </Typography>
      {questions.length === 0 ? (
        <Typography align="center">No sample questions available.</Typography>
      ) : (
        questions.map((question, index) => (
          <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Question {index + 1}</Typography>
            <Typography>{question.question_text || "Question text not available"}</Typography>
            {question.options && (
              <List>
                {question.options.map((option, optIndex) => (
                  <ListItem key={optIndex}>
                    <ListItemText primary={option} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        ))
      )}
      <Box textAlign="center" mt={2}>
        <Button variant="contained" color="primary" onClick={() => window.location.href = "/contact-us"}>
          Interested? Get in Touch!
        </Button>
      </Box>
    </Container>
  );
};

export default SampleQuestionsPage;
