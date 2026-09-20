import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";
import { sanitizeExamHtml } from "../../utils/examHtml";


const DragDropQuestionComponent = ({ question, onSubmit, submittedResult }) => {
  const {
    id: questionId,
    question: questionText = "",
    branches = [],
    explanation = [],
    additionalInfo = [],
    marks = 0,
    instructions = "",
    tabsInfo = [],
  } = question || {};

  // Build state to track every dropdown selection (one per branch)
  const [dropdownValues, setDropdownValues] = useState(
    branches.map(() => "")
  );
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  console.log("submitted result aan mone", submittedResult);


  const handleDropdownChange = (index, value) => {
    if (showReveal) return;
    setDropdownValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };


  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
  }, [questionId])


  useEffect(() => {
    if (submittedResult?.result && submittedResult.answers?.length > 0) {
      try {
        const answers = submittedResult.answers;

        // Map backend answers to dropdownValues by matching headings
        const parsedValues = {};

        answers.forEach(({ heading, answer }) => {
          // Match heading to branch heading (trim, case-insensitive)
          const idx = branches.findIndex(branch =>
            String(branch.headings).trim().toLowerCase() === String(heading).trim().toLowerCase()
          );
          if (idx !== -1) {
            parsedValues[idx] = answer;
          }
        });

        setDropdownValues(parsedValues);

        // Compute correctness
        const correctStatus = branches.every((branch, idx) =>
          String(parsedValues[idx]) === String(branch.drag_drop_answer)
        );

        setIsCorrect(correctStatus);
        setShowReveal(true);

        sessionStorage.setItem("hasAnswered", "true");
        sessionStorage.setItem("isRevealed", "true");
      } catch (e) {
        console.error("Error parsing previous drag-drop answers:", e);
      }
    }
  }, [submittedResult, branches]);



  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Reveal logic
  const handleReveal = () => {
    /* const hasAnswered = dropdownValues.some((val) => val && val !== "");
    if (!hasAnswered) {
      setShowNotAnsweredModal(true);
      return;
    } */

    if (submittedResult?.result) {
      return; // Already revealed, no action needed
    }


    // Check all five dropdowns are filled (no empty strings)
    const allFilled = dropdownValues.length === 5 && dropdownValues.every(val => val !== "");
    if (!allFilled) {
      setShowNotAnsweredModal(true);
      return;
    }

    const userAns = branches
      .map(
        (b, idx) =>
          `${b.headings}: ${dropdownValues[idx] || "Not selected"}`
      )
      .join("; ");
    const correctStatus = branches.every(
      (b, idx) =>
        String(dropdownValues[idx]) === String(b.drag_drop_answer)
    );

    const mark = correctStatus ? marks : 0;

    if (typeof onSubmit === "function") {
      onSubmit(questionId, correctStatus, mark, userAns);
    }

    // setUserAnswer(userAns);
    // setCorrectAnswer(correctAns);
    setIsCorrect(correctStatus);
    setShowReveal(true);


    // ✅ API CALL - ONLY ON /student/exam?testId=XXX
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank')) {
      console.log("inside drag-drop mock test response submitting");

      const drag_and_drop_answer = branches.map((branch, idx) => ({
        option_heading: branch.headings,
        droppedValue: dropdownValues[idx] || ""
      }));

      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type.toLowerCase(),
        test_id: testId,
        drag_and_drop_answer,
      };

      dispatch(submitMockTestQuestionResponseThunk(payload));
    }


    sessionStorage.setItem("hasAnswered", "true");
    sessionStorage.setItem("isRevealed", "true");
  };

  if (!question || !branches.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No drag-drop question data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 3, md: 5 },
        py: { xs: 3, md: 5 }
      }}
    >
      {/* Question Title */}
      <Typography
        component="div"
        variant="h6"
        className="q-stem q-html"
        sx={{
          fontWeight: 600,
          mb: 3,
           textAlign: "left",
          alignItems: "center",
          wordBreak: "break-word",
        }}
       dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(questionText) }} />

      {/* Instructions */}
      {instructions && (
        <Box sx={{ pb: 2, mb: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            className="q-instructions-label"
            align="left"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Instructions
          </Typography>
          <Typography
            component="div"
            variant="body1"
            className="q-instructions q-html"
            sx={{
              textAlign: "left",
              wordBreak: "break-word",
            }}
           dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(instructions) }} />
        </Box>
      )}

      {/* Tabs from tabsInfo */}
      {tabsInfo && tabsInfo.length > 0 && (
        <Box
          sx={{ mb: 6 }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
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
                  minWidth: { xs: 90, md: 110 },
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#475569",
                  border: "1px solid #e6eaef",
                  padding: { xs: "6px 14px", md: "8px 24px" },
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
              {tabsInfo.map((tab, idx) => (
                <Tab
                  key={tab.id || idx}
                  label={tab.tabKey}
                  value={idx}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              backgroundColor: "rgba(34, 211, 238, 0.08)",
              borderRadius: 2,
              p: { xs: 2, md: 2.5 },
              minHeight: { xs: "auto", md: 56 },
            }}
          >
            <Typography
              component="div"
              className="q-html"
              sx={{
                color: "var(--sf-text-soft)",
                textAlign: "left",
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.6,
                // Fix Quill <p> spacing
                '& p': { margin: 0, marginBottom: '0.5em' },
                '& p:last-child': { marginBottom: 0 },
                 '& *': { lineHeight: 'inherit' , wordBreak: "break-word", overflowWrap: "anywhere" },
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeExamHtml(tabsInfo[activeTab]?.tabValue || '')
              }}
            />
            {tabsInfo[activeTab]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[activeTab].tabImage.startsWith("http")
                      ? tabsInfo[activeTab].tabImage
                      : `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${tabsInfo[activeTab].tabImage}`
                  }
                  alt={tabsInfo[activeTab].tabKey}
                  style={{
                    maxWidth: "100%",
                    height: "auto",

                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Main Grid with Center Container and Surrounding Dropdowns */}
      <Box sx={{ mb: 4 }}>
        <Grid
          container
          spacing={3}
          sx={{
            position: "relative",
            minHeight: { xs: "auto", sm: "35vh" },
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {/* Left Side Dropdowns */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                height: "100%",
                justifyContent: "center",
                gap: 3,
              }}
            >
              {(() => {
                const remainingBranches = branches.slice(1);
                const n = remainingBranches.length;
                const split = Math.ceil(n / 2);
                const left = remainingBranches.slice(0, split);
                return left.map((b, idx) => {
                  const actualIndex = idx + 1;
                  return (
                    <Box key={`left-${b.id || idx}`}>
                      <Typography
                        component="div"
                        sx={{
                          color: "#f8fbff",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontWeight: 500,
                          mb: 1,
                          lineHeight: 1.4,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                        className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(b.headings) }}
                      />
                      <FormControl size="small" fullWidth>
                        <Select
                          value={dropdownValues[actualIndex] || ""}
                          onChange={(e) =>
                            handleDropdownChange(actualIndex, e.target.value)
                          }
                          displayEmpty
                          disabled={showReveal}
                          sx={{
                            borderRadius: "12px",
                            backgroundColor: showReveal
                              ? String(dropdownValues[actualIndex]) === String(b.drag_drop_answer)
                                ? "#dcfce7"  // ✅ GREEN
                                : "#fee2e2"  // ❌ RED
                              : "#fff",
                            border: showReveal
                              ? String(dropdownValues[actualIndex]) === String(b.drag_drop_answer)

                              : "1px solid #e5e7eb",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            minHeight: 40,
                          ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },
                          }}
                        >
                          <MenuItem value="" disabled sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                            <em>Select</em>
                          </MenuItem>
                          {b.dragdropoption?.map((opt) => (
                            <MenuItem key={opt.id} value={opt.options_value} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                              <div className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(opt.options_value) }} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  );
                });
              })()}
            </Box>
          </Grid>

          {/* Center Dropdown */}
          <Grid item xs={12} sm={4} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {branches.length > 0 && (
                <Box>
                  <Typography
                    component="div"
                    sx={{
                      color: "#f8fbff",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      fontWeight: 500,
                      mb: 1,
                      textAlign: "center",
                      lineHeight: 1.4,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                    className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(branches[0].headings) }}
                  />
                  <FormControl size="small" fullWidth>
                    <Select
                      value={dropdownValues[0] || ""}
                      onChange={(e) => handleDropdownChange(0, e.target.value)}
                      displayEmpty
                      disabled={showReveal}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: showReveal
                          ? String(dropdownValues[0]) === String(branches[0]?.drag_drop_answer)
                            ? "#dcfce7"  // ✅ GREEN
                            : "#fee2e2"  // ❌ RED
                          : "#fff",
                        border: showReveal
                          ? String(dropdownValues[0]) === String(branches[0]?.drag_drop_answer)

                          : "1px solid #e5e7eb",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        minHeight: 40,
                          ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },
                      }}
                    >
                      <MenuItem value="" disabled sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                        <em>Select</em>
                      </MenuItem>
                      {branches[0].dragdropoption?.map((opt) => (
                        <MenuItem key={opt.id} value={opt.options_value} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                          <div className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(opt.options_value) }} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Side Dropdowns */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                height: "100%",
                justifyContent: "center",
                gap: 3,
              }}
            >
              {(() => {
                const remainingBranches = branches.slice(1);
                const n = remainingBranches.length;
                const split = Math.ceil(n / 2);
                const right = remainingBranches.slice(split);
                return right.map((b, idx) => {
                  const actualIndex = split + idx + 1;
                  return (
                    <Box key={`right-${b.id || idx}`}>
                      <Typography
                        component="div"
                        sx={{
                          color: "#f8fbff",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontWeight: 500,
                          mb: 1,
                          lineHeight: 1.4,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                        className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(b.headings) }}
                      />
                      <FormControl size="small" fullWidth>
                        <Select
                          value={dropdownValues[actualIndex] || ""}
                          onChange={(e) =>
                            handleDropdownChange(actualIndex, e.target.value)
                          }
                          displayEmpty
                          disabled={showReveal}
                          sx={{
                            borderRadius: "12px",
                            backgroundColor: showReveal
                              ? String(dropdownValues[actualIndex]) === String(b.drag_drop_answer)
                                ? "#dcfce7"  // ✅ GREEN
                                : "#fee2e2"  // ❌ RED
                              : "#fff",
                            border: showReveal
                              ? String(dropdownValues[actualIndex]) === String(b.drag_drop_answer)

                              : "1px solid #e5e7eb",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            minHeight: 40,
                          ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },
                          }}
                        >
                          <MenuItem value="" disabled sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                            <em>Select</em>
                          </MenuItem>
                          {b.dragdropoption?.map((opt) => (
                            <MenuItem key={opt.id} value={opt.options_value} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                              <div className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(opt.options_value) }} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  );
                });
              })()}
            </Box>
          </Grid>
        </Grid>


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
          wordBreak: "break-word",
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
                Please fill in all required branches by selecting an option before revealing the answer and moving to the next question.
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

      </Box>

      {/* Reveal Answer Button */}
      <Box textAlign="center" mb={4}>
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: { xs: "0.5rem 2rem", md: "0.6rem 2.5rem" },
            borderRadius: "10px",
            fontSize: { xs: "0.9rem", md: "1rem" },
            "&:hover": { backgroundColor: "#e0b000" },
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
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
            component="h3"
            fontWeight={600}
            mb={1.5}
            color="#2E3760"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
          >
            Your Answer:
          </Typography>
          <Box
            sx={{
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            {branches.map((b, idx) => {
              const selected = dropdownValues[idx] || "Not selected";
              const correct = String(b.drag_drop_answer || "");
              const isMatch = String(selected) === correct;
              return (
                <Box
                  key={b.id || idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2,
                    pb: 2,
                    borderBottom:
                      idx < branches.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                    gap: 2,
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      color: "#f8fbff",
                      fontWeight: 500,
                      wordBreak: "break-word",
                      flex: "0 0 auto",
                      minWidth: { xs: "120px", sm: "150px" },
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                    className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml((b.headings || "") + ":") }}
                  />
                  <Typography
                    component="div"
                    sx={{
                      color: isMatch ? "green" : "red",
                      fontWeight: 600,
                      flex: 1,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                    dangerouslySetInnerHTML={{ __html: selected || "" }}
                  />
                </Box>
              );
            })}
          </Box>

          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight={600}
            mb={1.5}
            color="#24a129"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
          >
            Correct Answer:
          </Typography>
          <Box
            sx={{
              backgroundColor: "#f0fdf4",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            {branches.map((b, idx) => (
              <Box
                key={b.id || idx}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                  pb: 2,
                  borderBottom:
                    idx < branches.length - 1 ? "1px solid #e5e7eb" : "none",
                  gap: 2,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "#f8fbff",
                    fontWeight: 500,
                      wordBreak: "break-word",
                    flex: "0 0 auto",
                    minWidth: { xs: "120px", sm: "150px" },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                  className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml((b.headings || "") + ":") }}
                />
                <Typography
                  component="div"
                  sx={{
                    color: "#16a34a",
                    fontWeight: 600,
                    flex: 1,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                  dangerouslySetInnerHTML={{ __html: b.drag_drop_answer || "" }}
                />
              </Box>
            ))}
          </Box>

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
            //for preventing result modal to display again if answered
            submittedResult={submittedResult}
          />
        </Box>
      )}
    </Box>
  );
};

export default DragDropQuestionComponent;
