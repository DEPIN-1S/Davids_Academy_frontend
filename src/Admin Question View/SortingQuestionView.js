import React, { useEffect, useState } from "react";
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
import SortableItemComponentQuestionView from "./SortableItemComponentQuestionView";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../features/exam/examSlice";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function SortingQuestionView() {
  const { questionId } = useParams();
  const dispatch = useDispatch();
  const { questionData, loading } = useSelector((state) => state.exam);
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [showReveal, setShowReveal] = useState(false);

  const question = questionData?.data || {};
  const sortingOptions = question?.sortingoptions || [];
  const mark = questionData?.data?.marks;
  const difficulty = questionData?.data?.difficulty;
  const question_type = questionData?.data?.question_type;

  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  useEffect(() => {
    if (sortingOptions.length > 0) {
      setSteps([...sortingOptions].sort(() => Math.random() - 0.5));
    }
  }, [sortingOptions]);

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle drag reorder
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      setSteps((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleReveal = () => {
    setShowReveal(true);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Header: Question Info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          <strong>Marks:</strong> {mark || "-"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Difficulty:</strong> {difficulty || "-"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Type:</strong> {question_type || "-"}
        </Typography>
      </Box>

      {/* Question Text */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ textAlign: "center", mb: 2, pt: 4, fontSize: { xs: "1rem", md: "1.45rem", color: "#2e3760" } }}
      >
        {question?.question}
      </Typography>

      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          mt: 6,
          p: 4,

        }}
        className="sort-question-container"
      >

        {/* Sorting Box */}
        {!showReveal && (
          <Paper
            elevation={1}
            sx={{
              borderRadius: "12px",
              p: 3,
              backgroundColor: "#f9fafc",
              border: "1px solid #e0e0e0",
            }}
            className="sort-box"
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
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      p: 1.8,
                      mb: 1.5,
                      border: "1px solid #e0e0e0",
                      transition: "all 0.2s ease",
                      cursor: "grab",
                      "&:hover": {
                        backgroundColor: "#f3f8ff",
                        borderColor: "#1976d2",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <SortableItemComponentQuestionView
                      id={step.id}
                      text={step.sortItem}
                      index={idx}
                    />
                  </Box>
                ))}
              </SortableContext>
            </DndContext>
          </Paper>
        )}
      </Box>

      {questionData?.data?.instructions &&
        <Box sx={{ pb: "10px", py: 4, alignItems: "center", justifyContent: "center", textAlign: "center" }} >
          <Typography sx={{ fontWeight: 200 }} ><h4>Question Instruction</h4></Typography>
          <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 18, pt: 2 }}>
            {questionData?.data?.instructions}
          </Typography>
        </Box>
      }

      {/* Back Button */}
      <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
          }}
        >
          Back To Question Management
        </Button>
      </Box>
    </>
  );
}

export default SortingQuestionView;

