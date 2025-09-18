import React, { useState } from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import RevealAnswerComponent from './RevealAnswerComponent';

const StyledDropZone = styled(Paper)(({ theme }) => ({
  minHeight: 120,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: "2px dashed #ccc",
  background: "#fcfcfc",
  "&:hover": { background: "#f1f1f1" },
}));
const OptionPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  border: "1px solid #ddd",
  borderRadius: theme.spacing(1.5),
  backgroundColor: "#fff",
}));

const DragDropQuestionComponent = ({ question }) => {
  const {
    question: questionText = "",
    headings = [],
    drag_drop_content = "",
    explanation = [],
    additionalInfo = [],
    marks = 0,
  } = question;

  // Gather all drag options for all headings
  const allOptionItems = headings.flatMap(heading =>
    heading.dragdropoption.map(opt => ({
      id: `${heading.headings}-${opt.id}`,
      content: opt.options_value,
      group: heading.headings,
    }))
  );

  // Prepare initial zones: one for each heading, one for source
  const initialZones = headings.reduce((acc, heading) => {
    acc[heading.headings] = [];
    return acc;
  }, { source: allOptionItems });

  const [zones, setZones] = useState(initialZones);
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
      const items = [...zones[source.droppableId]];
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setZones({ ...zones, [source.droppableId]: items });
    }
  };

  // Reveal logic: maps headings to dropped, and correct answer
  const handleReveal = () => {
    const userAns = headings.map(heading => {
      const dropped = zones[heading.headings][0]?.content || 'Not selected';
      return `${heading.headings}: ${dropped}`;
    }).join('; ');
    const correctAns = headings.map(heading =>
      `${heading.headings}: ${heading.drag_drop_answer}`).join('; ');
    const correctStatus = headings.every(heading => {
      const dropped = zones[heading.headings][0]?.content;
      return dropped === heading.drag_drop_answer;
    });
    setUserAnswer(userAns);
    setCorrectAnswer(correctAns);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container justifyContent="center" alignItems="center" spacing={4} sx={{ minHeight: "30vh" }}>
        {/* LEFT SIDE: "Action" headings */}
        <Grid item xs={12} sm={4}>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={4}>
            {headings.filter(h => h.headings.toLowerCase().includes("action")).map(heading => (
              <Paper key={heading.headings} elevation={1} sx={{ p: 2, minWidth: 200, textAlign: "center", borderRadius: 2 }}>
                <Typography fontWeight={600}>{heading.headings}</Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
        {/* CENTER BLUE BOX */}
        <Grid item xs={12} sm={4}>
          <Box display="flex" justifyContent="center">
            <Paper elevation={3} sx={{
              p: 3,
              backgroundColor: "#1e2a4a",
              color: "#fff",
              borderRadius: 2,
              textAlign: "center",
              minWidth: 250,
            }}>
              <Typography fontWeight={700}>{drag_drop_content || "Potential Condition"}</Typography>
            </Paper>
          </Box>
        </Grid>
        {/* RIGHT SIDE: "Parameter" headings */}
        <Grid item xs={12} sm={4}>
          <Box display="flex" flexDirection="column" alignItems="flex-start" gap={4}>
            {headings.filter(h => h.headings.toLowerCase().includes("parameter")).map(heading => (
              <Paper key={heading.headings} elevation={1} sx={{ p: 2, minWidth: 200, textAlign: "center", borderRadius: 2 }}>
                <Typography fontWeight={600}>{heading.headings}</Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* DragDrop Grid: one zone per heading */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container justifyContent="center" sx={{ pt: 5 }} spacing={3}>
          {headings.map(heading => (
            <Grid item key={heading.headings}>
              <Paper elevation={0} sx={{ p: 2, minWidth: 320, border: "1px solid #ddd", borderRadius: 2, backgroundColor: "#f9f9f9", boxShadow: "0px 2px 6px rgba(0,0,0,0.05)" }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem", fontWeight: 600, color: "#333", textAlign: "center" }}>
                  {heading.headings}
                </Typography>
                <Droppable droppableId={heading.headings}>
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {zones[heading.headings].map((dragItem, idx) => (
                        <Draggable key={dragItem.id} draggableId={dragItem.id} index={idx}>
                          {(provided) => (
                            <OptionPaper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: 20, gap: "3px" }}>
                                <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                                <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                                <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                              </Box>
                              <Typography variant="body2" sx={{ textAlign: "left", color: "#333", fontSize: "0.9rem" }}>
                                {dragItem.content}
                              </Typography>
                            </OptionPaper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
        {/* Source Box: options to drag */}
        <Grid container justifyContent="center" sx={{ pt: 3 }} spacing={2}>
          <Grid item xs={12}>
            <Droppable droppableId="source" direction="horizontal">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} display="flex" justifyContent="center" flexWrap="wrap" gap={2} sx={{ minHeight: 64 }}>
                  {zones.source.map((dragItem, idx) => (
                    <Draggable key={dragItem.id} draggableId={dragItem.id} index={idx}>
                      {(provided) => (
                        <OptionPaper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: 20, gap: "3px" }}>
                            <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                            <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                            <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                          </Box>
                          <Typography variant="body2" sx={{ textAlign: "left", color: "#333", fontSize: "0.9rem" }}>
                            {dragItem.content}
                          </Typography>
                        </OptionPaper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>
      {/* Reveal Answer Section */}
      <Box textAlign="center" mt={4}>
        <Button variant="contained" onClick={handleReveal} sx={{ backgroundColor: "#f4c300", color: "#000", "&:hover": { backgroundColor: "#e0b000" } }}>
          Reveal Answer
        </Button>
      </Box>
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">Your Answer:</Typography>
          <Typography variant="body1" mb={3}>{userAnswer}</Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">Correct Answer:</Typography>
          <Typography variant="body1" mb={3}>{correctAnswer}</Typography>
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
