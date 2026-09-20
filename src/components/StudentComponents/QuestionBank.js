import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Dialog, DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";
import { getQuestionBankResult } from "../../features/exam/examSlice";
import QuestionBankProgressCard from "./QuestionBankProgressCard";
import CreateTestComponent from "./createTestComponent";



const QuestionBank = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // adjust selector based on your redux slice
  const isLoggedIn = user?.isLoggedIn || !!user?.id || !!sessionStorage.getItem("accessToken");

  const [showCreateTest, setShowCreateTest] = useState(false);

  const handleStartTest = () => {
    if (isLoggedIn) {
      // User logged in: open the Create Test modal
      setShowCreateTest(true);
    } else {
      // Not logged in: navigate to sample mode for without-auth sample questions
      navigate("/student/exam?mode=question-bank");
    }
  };

  const dispatch = useDispatch();
  const token = sessionStorage.getItem("accessToken");
  const [showProgressCard, setShowProgressCard] = useState(false);

  const viewProgress = () => {
    dispatch(getQuestionBankResult({ token, topicsQuery: "" }));
    setShowProgressCard(true);
  };
  
  const resultData = useSelector((state) => state.exam.questionBankResult);
  console.log("Result data:::", resultData);

  return (
    <Box
      className="sf-qbank-hero"
      sx={{
        borderRadius: "32px",
        padding: { xs: "3rem 1.5rem", md: "4rem 2rem" },
        textAlign: "center",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 2, fontFamily: '"Outfit", "Inter", sans-serif', letterSpacing: "-0.03em" }}
      >
        Practice & Master Your Exam Skills!
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "#c9d6ee", maxWidth: "600px", margin: "auto", mb: 3, fontFamily: '"Inter", sans-serif' }}
      >
        Access thousands of practice questions, track your performance, and
        build confidence for your healthcare exams.
      </Typography>

      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
        paddingTop: "10px"
      }} >

        <Button
          variant="contained"
          size="large"
          sx={{
            background: "linear-gradient(90deg, #f0c94a, #fbbf24)",
            color: "#04121f",
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 800,
            fontFamily: '"Outfit", "Inter", sans-serif',
            px: 5,
            py: "9px",
            boxShadow: "0 0 16px rgba(240, 201, 74, 0.28) !important",
            transform: "none !important",
            border: "2px solid transparent",
            transition: "all 0.25s ease",
            "&:hover": {
              background: "transparent",
              color: "#67e8f9",
              border: "2px solid #22d3ee",
              boxShadow: "none !important",
            },
          }}
          onClick={handleStartTest}
        >
          <span><FiPlus style={{ paddingBottom: "3px", fontSize: "20px" }} /></span>Start Test</Button>

        <Button
            onClick={viewProgress}
            size="large"
            sx={{
              border: "2px solid rgba(103, 232, 249, 0.45)",
              borderRadius: "999px",
              textTransform: "none",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontFamily: '"Outfit", "Inter", sans-serif',
              color: "#67e8f9",
              px: 4,
              "&:hover": {
                backgroundColor: "rgba(34, 211, 238, 0.12)",
                color: "#e8eefc",
                borderColor: "#22d3ee",
              },
            }}

          >
            View Progress
          </Button>
        


      </Box>


      <Dialog
        open={showCreateTest}
        onClose={() => setShowCreateTest(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: 'sf-topic-dialog',
          sx: {
            borderRadius: '20px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 8px 24px rgba(8,16,36,0.4)',
            overflow: 'hidden',
            maxWidth: '640px',
            width: '100%',
            m: { xs: 1.5, sm: 2 },
            bgcolor: 'rgba(12, 20, 42, 0.98)',
            color: '#ffffff',
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CreateTestComponent handleClose={() => setShowCreateTest(false)} />
        </DialogContent>
      </Dialog>

      {/* Render card only when needed */}
      {showProgressCard && (
        <QuestionBankProgressCard
          data={resultData}

          onClose={() => {
            setShowProgressCard(false);
            navigate("/student/question-bank");
          }}
        />
      )}

    </Box>
  );
};

export default QuestionBank;
