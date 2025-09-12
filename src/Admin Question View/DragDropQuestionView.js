import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../features/exam/examSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const StyledDropZone = styled(Paper)(({ theme }) => ({
  minHeight: 120,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: "2px dashed #ccc",
  background: "#f9f9f9",
}));

function DragDropQuestionView() {
  const { questionId } = useParams();
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [zones, setZones] = useState({});

  // ✅ Fetch question data
  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  // ✅ Initialize zones when dropdownquestiontext changes
  useEffect(() => {
    if (Array.isArray(questionData?.data?.dropdownquestiontext)) {
      const newZones = {};
      questionData.data.dropdownquestiontext.forEach((zone) => {
        newZones[zone.id] = [];
      });
      setZones(newZones);
    }
  }, [questionData]);

  useEffect(() => {
    console.log("Updated Drag drop question data in state:", questionData);
  }, [questionData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // ✅ Normalize arrays (avoids undefined.map crashes)
  const tabsInfo = questionData?.data?.tabsInfo || [];
  const branches = questionData?.data?.branches || [];

  return (
    <Box>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        pb: 3,
      }} >
        <Typography >
          Mark :{questionData?.data?.marks}
        </Typography>
        <Typography >
          Difficulty :{questionData?.data?.difficulty}
        </Typography>
        <Typography >
          Question Type : {questionData?.data?.question_type}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight={700} textAlign="center" mt={4} mb={2}>
        {questionData?.data?.question || "Loading..."}
      </Typography>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        {tabsInfo.map((tab) => (
          <Tab label={tab.tabKey} key={tab.id} />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box
        sx={{
          backgroundColor: "#f8f9ff",
          borderRadius: "10px",
          padding: "1rem",
          mb: 2,
          minHeight: "100px",
        }}
      >
        <Typography variant="body1" sx={{ color: "#333" }}>
          {tabsInfo[activeTab]?.tabValue || "No content available"}
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        {/* Main Layout */}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={4}
          sx={{ minHeight: "30vh" }}
        >
          {/* LEFT SIDE */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={4}>
              <Paper elevation={1} sx={{ p: 2, minWidth: 200, textAlign: "center", borderRadius: 2 }}>
                <Typography fontWeight={600}>Action to take</Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, minWidth: 200, textAlign: "center", borderRadius: 2 }}>
                <Typography fontWeight={600}>Action to take</Typography>
              </Paper>
            </Box>
          </Grid>

          {/* CENTER BOX */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="center">
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: "#1e2a4a",
                  color: "#fff",
                  borderRadius: 2,
                  textAlign: "center",
                  minWidth: 250,
                }}
              >
                <Typography fontWeight={700}>Most likely experiencing</Typography>
              </Paper>
            </Box>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" gap={4}>
              <Paper elevation={1} sx={{ p: 2, minWidth: 200, textAlign: "center", borderRadius: 2 }}>
                <Typography fontWeight={600}>Parameter to Monitor</Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, minWidth: 200, textAlign: "center", borderRadius: 2 }}>
                <Typography fontWeight={600}>Parameter to Monitor</Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Options (Branches) */}
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
                {/* Card Title */}
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

                {/* Options */}
                {branch.dragdropoption?.map((opt, index) => {
                  const isCorrect =
                    String(opt.id) === String(branch.drag_drop_answer);

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
                      {/* Left Handle */}
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

                      {/* Option Text */}
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "left",
                          color: "#333",
                          fontSize: "0.9rem",
                          fontWeight: isCorrect ? 600 : 400, // bold correct
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
      </Box>

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
}

export default DragDropQuestionView;
