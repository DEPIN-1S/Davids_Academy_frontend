import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
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
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";

const SortQuestionComponent = ({ question, onSubmit, submittedResult }) => {
  const {
    id: questionId,
    question: questionText,
    sortingoptions = [],
    explanation = [],
    additionalInfo = [],
    tabsInfo = [],
  } = question || {};

  const initialUserSteps = sortingoptions
    .map((opt) => ({
      id: String(opt.id),
      text: opt.sortItem,
      order: opt.itemOrder ?? null,
    }))
    .sort(() => Math.random() - 0.5);


  const dispatch = useDispatch();
  const location = useLocation();
  const [steps, setSteps] = useState(initialUserSteps);
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswer, setUserAnswer] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState(
    tabsInfo && tabsInfo.length ? tabsInfo[0].tabKey : ""
  );
  const [hasSorted, setHasSorted] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);

  useEffect(() => {
    // Reset sessionStorage on question change
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
    setHasSorted(false);
    setShowReveal(false);
  }, [questionId]);

  useEffect(() => {
    if (submittedResult?.result && submittedResult.answers?.length > 0) {
      try {
        console.log("Previous sorting answers:", submittedResult.answers);

        // Map backend answers by sortOrder → sortItem text
        const orderMap = {};
        submittedResult.answers.forEach(ans => {
          if (ans.sortItem && ans.sortOrder) {
            orderMap[ans.sortOrder] = ans.sortItem;
          }
        });

        // Rebuild steps array in user's saved order
        const restoredSteps = sortingoptions.map(opt => ({
          id: String(opt.id),
          text: opt.sortItem,
          order: opt.itemOrder ?? null,
        })).sort((a, b) => {
          // Match by text content to find user's saved position
          const userOrderA = Object.values(orderMap).indexOf(a.text);
          const userOrderB = Object.values(orderMap).indexOf(b.text);
          return (userOrderA || 999) - (userOrderB || 999);
        });

        console.log("Restored steps order:", restoredSteps);

        setSteps(restoredSteps);
        setHasSorted(true);

        // Calculate correctness
        const correctOrder = sortingoptions
          .map(opt => ({
            id: String(opt.id),
            text: opt.sortItem,
            order: opt.itemOrder ?? 9999,
          }))
          .sort((a, b) => a.order - b.order);

        const correctStatus = restoredSteps.every((step, idx) =>
          step.id === correctOrder[idx].id
        );

        setUserAnswer(restoredSteps.map(s => s.text));
        setCorrectAnswer(correctOrder.map(s => s.text));
        setIsCorrect(correctStatus);
        setShowReveal(true);

        sessionStorage.setItem("hasAnswered", "true");
        setShowNotAnsweredModal(false);
      } catch (error) {
        console.error("Could not restore previous sorting:", error);
      }
    }
  }, [submittedResult, sortingoptions]);

  useEffect(() => {
    if (tabsInfo && tabsInfo.length) setActiveTab(tabsInfo[0].tabKey);
  }, [tabsInfo]);

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      setSteps((prev) => arrayMove(prev, oldIndex, newIndex));
      setHasSorted(true);
      sessionStorage.setItem("hasAnswered", "true");
    }
  };

  const handleReveal = () => {
    if (submittedResult?.result) return;
    if (!hasSorted) {
      setShowNotAnsweredModal(true);
      return;
    }

    const correctOrder = sortingoptions
      .map((opt) => ({
        id: String(opt.id),
        text: opt.sortItem,
        order: typeof opt.itemOrder !== "undefined" ? opt.itemOrder : 9999,
      }))
      .sort((a, b) => a.order - b.order);

    const userAnswerStr = steps.map((step) => step.text).join(", ");
    const correctAnswerStr = correctOrder.map((step) => step.text).join(", ");
    const correctStatus = steps.every(
      (step, index) => step.id === correctOrder[index].id
    );
    const mark = correctStatus ? question?.marks || 5 : 0;
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    setUserAnswer(steps.map((s) => s.text));
    setCorrectAnswer(correctOrder.map((s) => s.text));
    setIsCorrect(correctStatus);
    setShowReveal(true);

    // ✅ API CALL - ONLY ON /student/exam?testId=XXX
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank')) {
      console.log("inside sorting mock test response submitting");

      const sortItems = steps.map((step, index) => ({
        sortItem: step.text,
        order: index + 1  // User's final order position (1, 2, 3...)
      }));

      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type,
        test_id: testId,
        sortItems,
      }
      dispatch(submitMockTestQuestionResponseThunk(payload));
    }
    sessionStorage.setItem("isRevealed", "true");
  };


  if (!question || !sortingoptions.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No sorting question data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      px: { xs: 3, md: 5 },
      py: { xs: 3, md: 5 }
    }} >
      <Typography sx={{
        color: "#2e3760",
        fontSize: { xs: "1rem", md: "1.25rem" },
        textAlign: "left",
        alignItems: "center",
          wordBreak: "break-word",
      }} variant="h6" fontWeight={700} mb={3} dangerouslySetInnerHTML={{ __html: questionText || "" }} />


      <Typography variant="body1" textAlign="center" mb={4}>
        Place the following actions in the order in which they should be
        performed, starting from first to last.
      </Typography>



      {/* Tabs */}
      {tabsInfo.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,

            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": { gap: 1 },
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
                  "&.Mui-selected": {
                    color: "#fff",
                    fontWeight: 600,
                    backgroundColor: "#2e3760",
                    border: "1px solid #2e3760",
                  },
                },
              }}
            >
              {tabsInfo.map((tab) => (
                <Tab
                  label={tab.tabKey}
                  value={tab.tabKey}
                  key={tab.id || tab.tabKey}
                />
              ))}
            </Tabs>
          </Box>
          <Box
            sx={{
              backgroundColor: "#eff1ffff",
              borderRadius: "10px",
              padding: "1rem",
              mb: 4,
              minHeight: "100px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                "& p": { margin: 0, marginBottom: "0.5em" },
                "& p:last-child": { marginBottom: 0 },
                "& *": { lineHeight: 1.6 , wordBreak: "break-word", overflowWrap: "anywhere" },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue ||
                  "No content available",
              }}
            />
          </Box>
        </>
      )}

      {/* Sortable Section */}
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
          steps.map((step, idx) => {
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
                }}
              >
                <Typography sx={{ color, fontWeight: 600 }}>
                  {step.text}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>

      {/* Reveal Button */}
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
            "&:hover": { backgroundColor: "#e0b000" },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Block reveal modal */}
      {showNotAnsweredModal && !submittedResult?.result && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: 3,
              borderRadius: "12px",
              width: "90%",
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                mb: 3,
                fontSize: "1rem",
                fontWeight: 600,
                color: "#2e3760",
              }}
            >
              Please change the order at least once before revealing the answer.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setShowNotAnsweredModal(false)}
              sx={{ backgroundColor: "#2e3760" }}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}

      {/* Reveal Section */}
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={2}
            color="#35b564ff"
            sx={{
              textAlign:"center"
            }}
          >
            Correct Order (Properly Sorted):
          </Typography>
          <Box
            sx={{
              maxWidth: "600px",
              margin: "0 auto",
              mb: 3,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              backgroundColor: "#f9fff9",
            }}
          >
            {correctAnswer.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  border: "1px solid #d6eed8",
                  borderRadius: "8px",
                  p: 1.5,
                  mb: 1.5,
                  backgroundColor: "#e6f4ea",
                }}
              >
                <Typography sx={{ color: "#1b7a3b", fontWeight: 600 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={1}
            mb={2}
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
                ? `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${question.additionalInfo[0].image}`
                : null
            }
            isAnswerCorrect={isCorrect}
            submittedResult={submittedResult}
          />
        </Box>
      )}
    </Box>
  );
};

export default SortQuestionComponent;
