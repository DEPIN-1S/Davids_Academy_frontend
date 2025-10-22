import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItemComponent from "./SortTableItemComponent";
import RevealAnswerComponent from "./RevealAnswerComponent";

const SortQuestionComponent = ({ question, onSubmit }) => {
  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    sortingoptions = [],
    explanation = [],
    additionalInfo = [],
    tabsInfo = [],
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
  // store arrays for easy per-item rendering
  const [userAnswer, setUserAnswer] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState(() =>
    tabsInfo && tabsInfo.length ? tabsInfo[0].tabKey : ""
  );

  useEffect(() => {
    if (tabsInfo && tabsInfo.length) setActiveTab(tabsInfo[0].tabKey);
  }, [tabsInfo]);

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
  };

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
        order: typeof opt.itemOrder !== "undefined" ? opt.itemOrder : 9999,
      }))
      .sort((a, b) => a.order - b.order);

    // User’s submitted order (text values in order)
    const userAnswerStr = steps.map((step) => step.text).join(", ");
    const correctAnswerStr = correctOrder.map((step) => step.text).join(", ");

    // Compare user order with correct order (check if IDs match in sequence)
    const correctStatus = steps.every(
      (step, index) => step.id === correctOrder[index].id
    );
    const mark = correctStatus ? question?.marks || 5 : 0;

    // Call onSubmit from ExamContainer
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    // Set states for reveal (store arrays for rendering)
    setUserAnswer(steps.map((s) => s.text));
    setCorrectAnswer(correctOrder.map((s) => s.text));
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  // Loading or no data state
  if (!question || !sortingoptions.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No sorting question data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", maxWidth: "950px", margin: "2rem auto" }}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        {questionText}
      </Typography>
      <Typography variant="body1" textAlign="center" mb={4}>
        Place the following actions in the order in which they should be
        performed, starting from first to last.
      </Typography>

      {/* Tabs for Contextual Information */}
      {tabsInfo.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              px: 1,
              position: "relative",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                sx: { display: "none" },
              }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
                "& .MuiTab-root": {
                  minHeight: 42,
                  minWidth: 110,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#475569",
                  border: "1px solid #e6eaef",
                  padding: { xs: "7px 18px", md: "8px 24px" },
                  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                    borderColor: "#e6eaef",
                  },
                  "&.Mui-selected": {
                    color: "#fff",
                    fontWeight: 600,
                    backgroundColor: "#2e3760",
                    border: "1px solid #2e3760",
                    boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
                  },
                },
              }}
            >
              {tabsInfo.map((tab) => (
                <Tab
                  label={tab.tabKey}
                  value={tab.tabKey}
                  key={tab.id || tab.tabKey}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>
          <Box
            sx={{
              backgroundColor: "#f8f9ff",
              borderRadius: "10px",
              padding: "1rem",
              mb: 4,
              minHeight: "100px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#333" }}>
              {tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue ||
                "No content available"}
            </Typography>
            {tabsInfo[activeTab]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[activeTab].tabImage.startsWith("http")
                      ? tabsInfo[activeTab].tabImage
                      : `${'https://lunarsenterprises.com:6040/'}${tabsInfo[activeTab].tabImage}`
                  }
                  alt="tab"
                  style={{
                    maxWidth: "100%",
                    borderRadius: 8,
                    height: "auto",
                  }}
                />
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Drag-and-drop Sort List (always visible). When revealed it's non-draggable and shows correctness colors */}
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
        {!showReveal ? (
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
        ) : (
          // Non-draggable static view showing user's final order with per-item correctness coloring
          <>
            {steps.map((step, idx) => {
              const correctText = correctAnswer[idx];
              const isMatch = correctText && step.text === correctText;
              const bg = isMatch ? "#e6f4ea" : "#ffecec";
              const color = isMatch ? "#1b7a3b" : "#c0392b";
              return (
                <Box
                  key={step.id}
                  sx={{
                    border: `1px solid ${isMatch ? "#d6eed8" : "#f6d6d6"}`,
                    borderRadius: "8px",
                    p: 1.5,
                    mb: 1.5,
                    backgroundColor: bg,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    cursor: "default",
                    "&:last-child": { mb: 0 },
                  }}
                >
                  <Typography sx={{ color, fontWeight: 600 }}>
                    {step.text}
                  </Typography>
                </Box>
              );
            })}
          </>
        )}
      </Box>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: "0.6rem 2.5rem",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#e0b000",
            },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            color="#2E3760"
          >
            Your Answer:
          </Typography>
          <List dense>
            {userAnswer.map((item, idx) => {
              const correctItem = correctAnswer[idx];
              const isMatch = item === correctItem;
              return (
                <ListItem key={idx} disablePadding>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      sx: { color: isMatch ? "green" : "red", fontWeight: 500 },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color="#35b564ff"
          >
            Correct Answer:
          </Typography>
          <List dense>
            {correctAnswer.map((item, idx) => {
              const userItem = userAnswer[idx];
              const isMatch = userItem === item;
              return (
                <ListItem key={idx} disablePadding>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      sx: { color: "green", fontWeight: 600 },
                    }}
                    secondary={
                      !isMatch && userItem
                        ? `Your choice: ${userItem}`
                        : undefined
                    }
                    secondaryTypographyProps={{
                      sx: {
                        color: !isMatch ? "red" : "inherit",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color={isCorrect ? "green" : "red"}
          >
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </Typography>

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || "Explanation"}
            explanationParagraphs={
              explanation.map((exp) => exp.explanation) || []
            }
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={
              additionalInfo.map((info) => info.info) || []
            }
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `https://lunarsenterprises.com:6040/${question.additionalInfo[0].image}`
                : null
            }

          />
        </Box>
      )}
    </Box>
  );
};

export default SortQuestionComponent;
