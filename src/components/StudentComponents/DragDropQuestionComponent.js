import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RevealAnswerComponent from "./RevealAnswerComponent";

const DragDropQuestionComponent = ({ question }) => {
  const {
    question: questionText = "",
    headings = [],
    drag_drop_content = "",
    explanation = [],
    additionalInfo = [],
    marks = 0,
  } = question;

  // Prefer dropdownquestiontext from API to build dropdowns
  const dropdownList = question.dropdownquestiontext || [];

  // Build state to track every dropdown selection (one per dropdown in dropdownList)
  const [dropdownValues, setDropdownValues] = useState(
    dropdownList.map(() => "")
  );
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDropdownChange = (index, value) => {
    // Prevent changing answers after reveal
    if (showReveal) return;

    setDropdownValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Reveal logic (use dropdownList)
  const handleReveal = () => {
    const userAns = dropdownList
      .map(
        (d, idx) => `${d.headings}: ${dropdownValues[idx] || "Not selected"}`
      )
      .join("; ");
    const correctAns = dropdownList
      .map((d) => `${d.headings}: ${d.drag_drop_answer}`)
      .join("; ");
    const correctStatus = dropdownList.every(
      (d, idx) => String(dropdownValues[idx]) === String(d.drag_drop_answer)
    );
    setUserAnswer(userAns);
    setCorrectAnswer(correctAns);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  const [activeTab, setActiveTab] = useState(
    question.tabsInfo?.[0]?.id || null
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Question Header Info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 2 },
          mb: 4,
        }}
      >
        <Typography sx={{ color: "#666" }}>
          Difficulty : {question.difficulty}
        </Typography>
      </Box>

      {/* Question Title */}
      <Typography
        variant="h5"
        sx={{
          color: "#2F3B6C",
          fontWeight: 600,
          mb: 3,
          textAlign: "center",
        }}
      >
        {question.question}
      </Typography>

      {/* Tabs from tabsInfo */}
      {question.tabsInfo && question.tabsInfo.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
              justifyContent: "center",
            }}
          >
            {question.tabsInfo.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "contained" : "outlined"}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  borderRadius: "20px",
                  px: 3,
                  py: 1,
                  backgroundColor:
                    activeTab === tab.id ? "#2F3B6C" : "transparent",
                  color: activeTab === tab.id ? "white" : "#2F3B6C",
                  "&:hover": {
                    backgroundColor:
                      activeTab === tab.id
                        ? "#2F3B6C"
                        : "rgba(47, 59, 108, 0.04)",
                  },
                }}
              >
                {tab.tabKey}
              </Button>
            ))}
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              backgroundColor: "#F8F9FB",
              p: 3,
              borderRadius: 2,
              mb: 4,
            }}
          >
            {question.tabsInfo.map(
              (tab) =>
                activeTab === tab.id && (
                  <Box key={tab.id}>
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                      {tab.tabValue}
                    </Typography>
                    {tab.tabImage && (
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <img
                          src={
                            tab.tabImage.startsWith("http")
                              ? tab.tabImage
                              : `${process.env.REACT_APP_API_URL}/${tab.tabImage}`
                          }
                          alt={tab.tabKey}
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </Box>
                    )}
                  </Box>
                )
            )}
          </Box>
        </>
      )}

      {/* Main Grid with Center Container and Surrounding Dropdowns */}
      <Grid
        container
        spacing={3}
        sx={{
          position: "relative",
          minHeight: { xs: "auto", sm: "35vh" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Left Side Dropdowns */}
        <Grid item xs={12} sm={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {(() => {
              // Skip the first dropdown as it's in the center
              const remainingDropdowns = dropdownList.slice(1);
              const n = remainingDropdowns.length;
              const split = Math.ceil(n / 2);
              const left = remainingDropdowns.slice(0, split);
              return left.map((d, idx) => (
                <FormControl
                  key={`left-${d.id || idx}`}
                  size="small"
                  sx={{
                    width: { xs: "280px", sm: "300px", md: "400px" },
                  }}
                >
                  <Select
                    value={dropdownValues[idx + 1]}
                    onChange={(e) =>
                      handleDropdownChange(idx + 1, e.target.value)
                    }
                    displayEmpty
                    disabled={showReveal}
                    /* renderValue removed so selected text uses default color */
                    sx={{
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      px: 2,
                      py: 0.5,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select {d.headings}
                    </MenuItem>
                    {d.dragdropoption.map((opt) => (
                      <MenuItem key={opt.id} value={opt.options_value}>
                        {opt.options_value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ));
            })()}
          </Box>
        </Grid>

        {/* Center Dropdown */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {dropdownList.length > 0 && (
            <FormControl
              size="small"
              sx={{
                width: { xs: "280px", sm: "300px", md: "400px" },
              }}
            >
              <Select
                value={dropdownValues[0]}
                onChange={(e) => handleDropdownChange(0, e.target.value)}
                displayEmpty
                disabled={showReveal}
                sx={{
                  borderRadius: 4,
                  backgroundColor: "#fff",
                  px: 2,
                  py: 0.5,
                }}
              >
                <MenuItem value="" disabled>
                  Select {dropdownList[0].headings}
                </MenuItem>
                {dropdownList[0].dragdropoption.map((opt) => (
                  <MenuItem key={opt.id} value={opt.options_value}>
                    {opt.options_value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>

        {/* Right Side Dropdowns */}
        <Grid item xs={12} sm={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {(() => {
              // Skip the first dropdown as it's in the center
              const remainingDropdowns = dropdownList.slice(1);
              const n = remainingDropdowns.length;
              const split = Math.ceil(n / 2);
              const right = remainingDropdowns.slice(split);
              return right.map((d, idx) => (
                <FormControl
                  key={`right-${d.id || idx}`}
                  size="small"
                  sx={{
                    width: { xs: "280px", sm: "300px", md: "400px" },
                  }}
                >
                  <Select
                    value={dropdownValues[split + idx + 1]}
                    onChange={(e) =>
                      handleDropdownChange(split + idx + 1, e.target.value)
                    }
                    displayEmpty
                    disabled={showReveal}
                    /* renderValue removed so selected text uses default color */
                    sx={{
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      px: 2,
                      py: 0.5,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select {d.headings}
                    </MenuItem>
                    {d.dragdropoption.map((opt) => (
                      <MenuItem key={opt.id} value={opt.options_value}>
                        {opt.options_value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ));
            })()}
          </Box>
        </Grid>
      </Grid>

      {/* Reveal Answer Section */}
      <Box textAlign="center" mt={4}>
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
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            color="#2E3760"
          >
            Your Answer:
          </Typography>
          <Box mb={3}>
            {dropdownList.map((d, idx) => {
              const selected = dropdownValues[idx] || "Not selected";
              const correct = String(d.drag_drop_answer || "");
              const isMatch = String(selected) === correct;
              return (
                <Box
                  key={d.id || idx}
                  sx={{
                    display: "flex",
                    // justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: "transparent",
                  }}
                >
                  <Typography sx={{ color: "#333" }}>{d.headings}:</Typography>
                  <Box sx={{ width: 50 }} /> {/* Spacer */}
                  <Typography
                    sx={{ color: isMatch ? "green" : "red", fontWeight: 600 }}
                  >
                    {selected}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            color="#2E3760"
          >
            Correct Answer:
          </Typography>
          <Typography variant="body1" mb={3}>
            {correctAnswer}
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={600}
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
            additionalInfoImage={additionalInfo[0]?.image || null}
          />
        </Box>
      )}
    </Box>
  );
};

export default DragDropQuestionComponent;
