import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, Grid, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import RevealAnswerComponent from './RevealAnswerComponent';
const StyledDropZone = styled(Paper)(({ theme }) => ({
  minHeight: 120,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: "2px dashed #ccc",
  background: "#f9f9f9",
  "&:hover": {
    background: "#f0f0f0",
  },
}));

const DragDropQuestionComponent = ({ question, onSubmit }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Question prop received:", question);
  }, [question]);

  const {
    id: questionId,
    question: questionText,
    question_type: questionType,
    headings = [],
    explanation = [],
    additionalInfo = [],
  } = question || {};

  // Initialize draggable items from dragdropoption across all headings
  const initialItems = headings.reduce((acc, heading) => {
    heading.dragdropoption.forEach(opt => {
      acc.push({
        id: opt.id.toString(),
        content: opt.options_value,
      });
    });
    return acc;
  }, []);

  const initialZones = headings.reduce((acc, heading) => {
    acc[heading.id.toString()] = []; // Empty drop zone for each heading
    return acc;
  }, { source: initialItems }); // Source zone with all items

  const [zones, setZones] = useState(initialZones);
  const [isLoading, setIsLoading] = useState(!question);
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...zones[source.droppableId]];
      const destItems = [...zones[destination.droppableId]];
      const [draggedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, draggedItem);
      setZones({
        ...zones,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    } else {
      // Reorder within the same zone
      const items = [...zones[source.droppableId]];
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setZones({ ...zones, [source.droppableId]: items });
    }
  };

  const handleReveal = () => {
    // User answer: mapping headings to dropped items
    const userAns = headings.map(heading => {
      const dropped = zones[heading.id.toString()][0]?.content || 'Not selected';
      return `${heading.headings}: ${dropped}`;
    }).join('; ');

    // Correct answer from data
    const correctAns = headings.map(heading => `${heading.headings}: ${heading.drag_drop_answer}`).join('; ');

    // Check correctness (assuming one correct per heading, and exact match)
    const correctStatus = headings.every(heading => {
      const dropped = zones[heading.id.toString()][0]?.content;
      return dropped === heading.drag_drop_answer;
    });
    const mark = correctStatus ? (question?.marks || 5) : 0;

    // Call onSubmit
    onSubmit(questionId, correctStatus, mark, userAns);

    // Set states for reveal
    setUserAnswer(userAns);
    setCorrectAnswer(correctAns);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  useEffect(() => {
    if (question) {
      setIsLoading(false);
    }
  }, [question]);

  if (isLoading) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading question data...</Typography>
      </Box>
    );
  }

  if (!question || !headings.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No drag and drop question data available</Typography>
      </Box>
    );
  }

  if (questionType !== "Drag Drop") {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>Wrong question type: {questionType}. Expected "Drag Drop".</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={3}>
        {questionText || "Drag the options into the appropriate categories"}
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        {!showReveal && (
          <>
            <Grid container spacing={3} justifyContent="center" mb={4}>
              {headings.map((heading) => (
                <Grid item xs={12} sm={6} md={4} key={heading.id}>
                  <Typography fontWeight={600} mb={1} textAlign="center">
                    {heading.headings}
                  </Typography>
                  <Droppable droppableId={heading.id.toString()}>
                    {(provided) => (
                      <StyledDropZone
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          backgroundColor: zones[heading.id.toString()]?.length > 0 ? "#e0f7fa" : undefined,
                        }}
                      >
                        {zones[heading.id.toString()].map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  backgroundColor: "#fff",
                                  borderRadius: 1,
                                  p: 1,
                                  mb: 1,
                                  boxShadow: 1,
                                  fontSize: "0.9rem",
                                }}
                              >
                                {item.content}
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </StyledDropZone>
                    )}
                  </Droppable>
                </Grid>
              ))}
            </Grid>

            <Box textAlign="center" mb={4}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Options
              </Typography>
              <Droppable droppableId="source" direction="horizontal">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    display="flex"
                    justifyContent="center"
                    flexWrap="wrap"
                    gap={2}
                  >
                    {zones.source.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: 1,
                              p: 1,
                              minWidth: 250,
                              textAlign: "center",
                              fontSize: "0.9rem",
                              boxShadow: 1,
                            }}
                          >
                            {item.content}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </>
        )}
      </DragDropContext>

      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            "&:hover": { backgroundColor: "#e0b000" },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Your Answer:
          </Typography>
          <Typography variant="body1" mb={3}>
            {userAnswer}
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Correct Answer:
          </Typography>
          <Typography variant="body1" mb={3}>
            {correctAnswer}
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} mb={1} color={isCorrect ? 'green' : 'red'}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </Typography>

         
          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || 'Explanation'}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading='Additional Info'
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={additionalInfo[0]?.image || null}
          />
        </Box>
      )}
    </Box>
  );
};

export default DragDropQuestionComponent;
