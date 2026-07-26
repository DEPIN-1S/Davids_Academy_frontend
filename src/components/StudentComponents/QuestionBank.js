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
      sx={{
        background:
          "radial-gradient(circle at center, #fcebb3 10%, #f9f9fb 100%)",
        borderRadius: "32px",
        padding: { xs: "3rem 1.5rem", md: "4rem 2rem" },
        textAlign: "center",
        maxWidth: "1000px",
        margin: "auto",
         border: "1px solid #2E3760",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 2 }}
      >
        Practice & Master Your Exam Skills!
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "#333", maxWidth: "600px", margin: "auto", mb: 3 }}
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
            backgroundColor: "#2E3760",
            borderRadius: "23px",
            textTransform: "none",
            fontWeight: 600,
            px: 5,
            py: "9px",
            boxShadow: "none !important",   // Remove MUI hover shadow
            transform: "none !important",   // Remove hover transform
            border: "2px solid transparent", // Prevent shift on hover
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#1e264c",
              border: "2px solid #2E3760",
            },
          }}
          onClick={handleStartTest}
        >
          <span><FiPlus style={{ paddingBottom: "3px", fontSize: "20px" }} /></span>Start Test</Button>

        <Button
            onClick={viewProgress}
            size="large"
            sx={{
              border: "2px solid #2E3760",
              borderRadius: "23px",
              textTransform: "none",
              backgroundColor: "transparent",
              fontWeight: 600,
              color: "#2E3760",
              px: 4,
              "&:hover": {
                backgroundColor: "#2E3760",
                color: "#fff",
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
          sx: {
            borderRadius: '20px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(26,115,232,0.1)',
            overflow: 'hidden',
            maxWidth: '640px',
            width: '100%',
            m: { xs: 1.5, sm: 2 },
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
