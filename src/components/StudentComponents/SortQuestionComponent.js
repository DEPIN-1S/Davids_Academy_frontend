import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableItemComponent from './SortTableItemComponent';
import RevealAnswerComponent from './RevealAnswerComponent';

const SortQuestionComponent = ({ question, onSubmit }) => {
  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    sortingoptions = [],
    explanation = [],
    additionalInfo = [],
  } = question || {};

  // Initialize sortable items (randomized)
  const initialUserSteps = sortingoptions
    .map((opt) => ({
      id: String(opt.id),
      text: opt.sortItem,
      order: opt.itemOrder ?? null,
    }))
    .sort(() => Math.random() - 0.5);

  const [steps, setSteps] = useState(initialUserSteps);
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Sensors for DND Kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle drag end to update order
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      setSteps((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  // Handle reveal (submission and show answers)
  const handleReveal = () => {
    // Correct order based on itemOrder
    const correctOrder = sortingoptions
      .map((opt) => ({
        id: String(opt.id),
        text: opt.sortItem,
        order: typeof opt.itemOrder !== 'undefined' ? opt.itemOrder : 9999,
      }))
      .sort((a, b) => a.order - b.order);

    // User’s submitted order (text values in order)
    const userAnswerStr = steps.map((step) => step.text).join(', ');
    const correctAnswerStr = correctOrder.map((step) => step.text).join(', ');

    // Compare user order with correct order (check if IDs match in sequence)
    const correctStatus = steps.every((step, index) => step.id === correctOrder[index].id);
    const mark = correctStatus ? (question?.marks || 5) : 0;

    // Call onSubmit from ExamContainer
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    // Set states for reveal
    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  // Loading or no data state
  if (!question || !sortingoptions.length) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography>No sorting question data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '2rem', maxWidth: '950px', margin: '2rem auto' }}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        {questionText}
      </Typography>
      <Typography variant="body1" textAlign="center" mb={4}>
        Place the following actions in the order in which they should be performed, starting from first to last.
      </Typography>

      {/* Drag-and-drop Sort List */}
      {!showReveal && (
        <Box
          sx={{
            maxWidth: "600px",
            margin: "0 auto",
            mb: 4,
            p: 2,
            border: "1px solid #ccc",    
            borderRadius: "10px",
            backgroundColor: "#fafafa",
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map((step) => step.id)}
              strategy={verticalListSortingStrategy}
            >
              {steps.map((step, idx) => (
                <Box
                  key={step.id}
                  sx={{
                    border: "1px solid #e0e0e0",  
                    borderRadius: "8px",
                    p: 1.5,
                    mb: 1.5,                      
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    cursor: "grab",
                    "&:last-child": { mb: 0 },    
                    "&:hover": {
                      borderColor: "#1976d2",     
                      backgroundColor: "#f5faff",
                    },
                  }}
                >
                  <SortableItemComponent
                    id={step.id}
                    text={step.text}
                    index={idx}
                  />
                </Box>
              ))}
            </SortableContext>
          </DndContext>
        </Box>
      )}


      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: '#f4c300',
            color: '#000',
            fontWeight: 600,
            padding: '0.6rem 2.5rem',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#e0b000',
            },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Your Answer:
          </Typography>
          <List dense>
            {userAnswer.split(', ').map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#35b564ff">
            Correct Answer:
          </Typography>
          <List dense>
            {correctAnswer.split(', ').map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color={isCorrect ? 'green' : 'red'}>
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

export default SortQuestionComponent;
