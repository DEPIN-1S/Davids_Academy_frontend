import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Button, styled } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../features/exam/examSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DragDropQuestionView = () => {
  const { questionId } = useParams();
  const dispatch = useDispatch();
  const { questionData } = useSelector((state) => state.exam);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("");

  // Fetch question data
  useEffect(() => {
    if (questionId) dispatch(getQuestionData(questionId));
  }, [dispatch, questionId]);

  // Set default tab immediately after questionData loads
  useEffect(() => {
    const firstTab = questionData?.data?.tabsInfo?.[0]?.tabKey;
    if (firstTab) setActiveTab(firstTab);
  }, [questionData]);

  const handleTabClick = (tabKey) => setActiveTab(tabKey);

  const tabsInfo = questionData?.data?.tabsInfo || [];
  const branches = questionData?.data?.branches || [];

  return (
    <Box>
      {/* Question Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", pb: 3 }}>
        <Typography>Mark: {questionData?.data?.marks}</Typography>
        <Typography>Difficulty: {questionData?.data?.difficulty}</Typography>
        <Typography>Question Type: {questionData?.data?.question_type}</Typography>
      </Box>

      {/* Question Text */}
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textAlign: "center", color: "#2e3760", py: 4 }}
      >
        {questionData?.data?.question}
      </Typography>

      {/* Tabs */}
      {tabsInfo.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {tabsInfo.map((tab, idx) => (
            <Button
              key={tab.id}
              onClick={() => handleTabClick(tab.tabKey)}
              sx={{
                borderRadius: "50px", // full rounded pill
                px: 4,
                py: 1,
                minWidth: 80,
                fontWeight: activeTab === tab.tabKey ? 700 : 400,
                bgcolor: activeTab === tab.tabKey ? "#1e2a4a" : "#f0f0f0",
                color: activeTab === tab.tabKey ? "#fff" : "#333",
                "&:hover": {
                  bgcolor: activeTab === tab.tabKey ? "#1e2a4a" : "#e0e0e0",
                },
              }}
            >
              {tab.tabKey}
            </Button>
          ))}
        </Box>
      )}

      {/* Tab Content */}
      <div className="note-box" style={{ marginTop: "1rem", textAlign: "center" }}>
        {tabsInfo.length > 0 && (
          <>
            {tabsInfo.find((t) => t.tabKey === activeTab)?.tabImage && (
              <img
                src={`https://lunarsenterprises.com:8002/${tabsInfo.find((t) => t.tabKey === activeTab)?.tabImage}`}
                alt="Exhibit"
                style={{ width: 500, borderRadius: "8px", marginBottom: "1rem" }}
              />
            )}
          </>
        )}
        <Typography sx={{ color: "#333", textAlign: 'left' }} variant="body1">
          {tabsInfo.find((t) => t.tabKey === activeTab)?.tabValue}
        </Typography>
      </div>

      {questionData?.data?.instructions &&
        <Box sx={{ pb: "10px", py: 4, alignItems: "center", justifyContent: "center", textAlign: "center" }} >
          <Typography sx={{ fontWeight: 200 }} ><h4>Question Instruction</h4></Typography>
          <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 15, pt: 2 }}>
            {questionData?.data?.instructions}
          </Typography>
        </Box>
      }

      {/* Branches */}
      <Grid container justifyContent="center" sx={{ pt: 5 }} spacing={3}>
        {branches.map((branch, idx) => (
          <Grid item key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                minWidth: 320,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#333",
                  textAlign: "center",
                }}
              >
                {branch.headings || "Action to take"}
              </Typography>

              {branch.dragdropoption?.map((opt, index) => {
                const isCorrect = String(opt.id) === String(branch.drag_drop_answer);
                return (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      mb: 1.5,
                      border: "1px solid #ddd",
                      borderRadius: 1.5,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 20,
                        gap: "3px",
                      }}
                    >
                      <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                      <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                      <Box sx={{ width: "14px", height: "2px", bgcolor: "#999", borderRadius: 1 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "left",
                        color: "#333",
                        fontSize: "0.9rem",
                        fontWeight: isCorrect ? 600 : 400,
                      }}
                    >
                      {opt.options_value}
                    </Typography>
                  </Paper>
                );
              })}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Back Button */}
      <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back To Question Management
        </Button>
      </Box>
    </Box>
  );
};

export default DragDropQuestionView;
