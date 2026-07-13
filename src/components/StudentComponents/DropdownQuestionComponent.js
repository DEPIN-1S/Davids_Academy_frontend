import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";


const DropdownQuestionComponent = ({ question, onSubmit, submittedResult }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [dropdownValues, setDropdownValues] = useState({});
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();


  const {
    id: questionId,
    question: questionText,
    dropdowns = [],
    tabsInfo = [],
    explanation = [],
    instructions,
  } = question || {};

  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
    if (!dropdowns.length) return;
    const initialValues = {};
    dropdowns.forEach((dt) => {
      if (dt?.id) {
        initialValues[dt.id] = "";
      }
    });
    setDropdownValues(initialValues);
  }, [dropdowns]);


  useEffect(() => {
    if (submittedResult?.result && submittedResult.answers?.length > 0) {
      try {
        console.log("Previous answers received:", submittedResult.answers);

        // Parse answers array: [{dropdownField: "Field Name", answer: "Value"}, ...]
        const parsedAnswers = {};

        submittedResult.answers.forEach(answerObj => {
          if (answerObj.dropdownField && answerObj.answer) {
            // Find matching dropdown by dropdownField
            const matchingDropdown = dropdowns.find(dt =>
              dt.dropdownField === answerObj.dropdownField ||
              (dt.dropdownField || `Option ${dt.id}`).includes(answerObj.dropdownField)
            );

            if (matchingDropdown && matchingDropdown.id) {
              parsedAnswers[matchingDropdown.id] = answerObj.answer;
            }
          }
        });

        console.log("Parsed dropdown values:", parsedAnswers);

        // Populate dropdowns with previous selections
        setDropdownValues(prev => ({ ...prev, ...parsedAnswers }));

        // Calculate correctness
        const correctStatus = dropdowns.every((dt) => {
          const dropdownId = dt.id;
          const backendAnswer = dt.dropdownanswer;
          const fallbackVal = dt.dropdownoption?.find((opt) => opt.is_correct)?.dropdownValue || dt.dropdownoption?.[0]?.dropdownValue;
          const correctVal = backendAnswer ?? fallbackVal;
          const userVal = parsedAnswers[dropdownId];
          return String(userVal) === String(correctVal);
        });

        setIsCorrect(correctStatus);
        setShowReveal(true);

        sessionStorage.setItem("hasAnswered", "true");
        sessionStorage.setItem("isRevealed", "true");
      } catch (error) {
        console.log("Could not parse previous dropdown answers:", error);
      }
    }
  }, [submittedResult, dropdowns]);


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (!tabsInfo || !tabsInfo.length) {
      setActiveTab(0);
      return;
    }
    setActiveTab((prev) => Math.min(prev, tabsInfo.length - 1));
  }, [tabsInfo]);

  const handleDropdownChange = (id) => (event) => {
    if (showReveal) return;
    setDropdownValues((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  const handleReveal = () => {

    if (submittedResult?.result) {
      return; // Already revealed, no action needed
    }


    // Check all dropdowns selected (non-empty)
    const allFilled = dropdowns.every((dt) => {
      const val = dropdownValues[dt.id];
      return val !== "" && val !== undefined && val !== null;
    });

    if (!allFilled) {
      setShowNotAnsweredModal(true);
      return;
    }

    const userAnswerStr = dropdowns
      .map((dt) => {
        const dropdownId = dt.id;
        return `${dt.dropdownField || "Option"}: ${dropdownValues[dropdownId] || "Not selected"
          }`;
      })
      .join(", ");

    const correctStatus = dropdowns.every((dt) => {
      const dropdownId = dt.id;
      const backendAnswer = dt.dropdownanswer;
      const fallbackVal =
        dt.dropdownoption?.find((opt) => opt.is_correct)?.dropdownValue ||
        dt.dropdownoption?.[0]?.dropdownValue;
      const correctVal = backendAnswer ?? fallbackVal;
      return String(dropdownValues[dropdownId]) === String(correctVal);
    });

    const mark = correctStatus ? question?.marks || 5 : 0;

    if (typeof onSubmit === "function") {
      onSubmit(questionId, correctStatus, mark, userAnswerStr);
    }

    // setUserAnswer(userAnswerStr);
    // setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowReveal(true);

    // ✅ 12 lines - ONLY calls API on /student/exam?testId=XXX
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank')) {
      const answers = dropdowns.map((dt) => ({
        dropdownField: dt.dropdownField || `Option ${dt.id}`,
        selectedValue: dropdownValues[dt.id] || ""
      }));

      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type,
        test_id: testId,
        answers,
      };

      dispatch(submitMockTestQuestionResponseThunk(payload));
    }

    sessionStorage.setItem("hasAnswered", "true");
    sessionStorage.setItem("isRevealed", "true");
  };

  if (!question || !dropdowns.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No dropdown question data available</Typography>
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
      {/* Header row */}
      {/* <Box sx={{ width: "100%", pt: 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
        </Box>
      </Box> */}

      {/* Title */}
      <Typography
        component="div"
        variant="h6"
        sx={{
          color: "#2e3760",
          fontSize: { xs: "1rem", md: "1.25rem" },
          textAlign: "left",
          alignItems: "center",
          wordBreak: "break-word",
        }} fontWeight={700} mb={5}
       dangerouslySetInnerHTML={{ __html: questionText || "" }} />

      {/* Instructions */}
      {!!instructions && (
        <Box sx={{ pb: 2, mb: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            align="left"
            sx={{ mb: 1, color: "text.primary", fontWeight: 600,fontSize: { xs: "0.9rem", md: "1rem" }, }}
          >
            Instructions :
          </Typography>
          <Typography
            component="div"
            variant="body1"
            sx={{
              textAlign: "left",
              color: "black",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
              wordBreak: "break-word",
            }}
           dangerouslySetInnerHTML={{ __html: instructions || "" }} />
        </Box>
      )}

      {/* Tabs Card */}
      <Box
        sx={{

          borderRadius: "1.5rem",

          mb: 3,

        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            position: "relative",
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
            {tabsInfo?.map((tab, idx) => (
              <Tab key={tab.id || idx} label={tab.tabKey} value={idx} disableRipple />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            backgroundColor: "#eff1ffff",
            borderRadius: 2,
            p: { xs: 2, md: 2.5 },
          }}
        >
          <Typography
            component="div"
            sx={{
              color: "#374151",
              textAlign: "left",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
              "& p": { margin: 0, marginBottom: "0.5em" },
              "& p:last-child": { marginBottom: 0 },
              "& *": { lineHeight: "inherit" , wordBreak: "break-word", overflowWrap: "anywhere" },
            }}
            dangerouslySetInnerHTML={{
              __html: tabsInfo[activeTab]?.tabValue || "",
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
      </Box>

      {/* Dropdowns */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            backgroundColor: "#f1f5f9",
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {dropdowns.map((dt, index) => {
            const id = dt.id || index;
            const label = dt.dropdownField || `Select ${index + 1}`;
            const options = dt.dropdownoption || [];

            return (
              <Box
                key={id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "flex-start",
                  gap: { xs: 0.5, sm: 1.5 },
                  width: { xs: "100%", sm: "auto" },
                  flex: { xs: "1 1 100%", sm: "1 1 auto" },
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "#0f172a",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    fontWeight: 500,
                    lineHeight: 1.4,
                    maxWidth: { xs: "100%", sm: "250px", md: "300px" },
                  }}
                  dangerouslySetInnerHTML={{ __html: label || "" }}
                />
                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: 160, md: 180 },
                  }}
                >
                  <Select
                    value={dropdownValues[id] || ""}
                    onChange={handleDropdownChange(id)}
                    disabled={showReveal}
                    displayEmpty
                    sx={{
                      height: 40,
                      borderRadius: "12px",
                      backgroundColor: showReveal
                        ? (() => {
                          const backendAnswer = dt.dropdownanswer;
                          const fallbackVal =
                            dt.dropdownoption?.find((opt) => opt.is_correct)?.dropdownValue ||
                            dt.dropdownoption?.[0]?.dropdownValue;
                          const correctVal = backendAnswer ?? fallbackVal;
                          const isCorrectVal =
                            String(dropdownValues[id]) === String(correctVal);
                          return isCorrectVal
                            ? "rgba(34,197,94,0.15)" // ✅ light green
                            : "rgba(239,68,68,0.15)"; // ❌ light red
                        })()
                        : "#fff",
                      border: "1px solid #e5e7eb",
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(47,59,108,0.08)",
                      },
                      ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },
                    }}
                  >
                    <MenuItem value="" sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                      <em>Select</em>
                    </MenuItem>
                    {options.map((opt, oi) => (
                      <MenuItem key={opt.id || oi} value={opt.dropdownValue} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                        <div dangerouslySetInnerHTML={{ __html: opt.dropdownValue || "" }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Box>
            );
          })}
        </Box>
        {showNotAnsweredModal && !submittedResult?.result && (
          <Box sx={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          wordBreak: "break-word",
            zIndex: 9999,
          }}>
            <Box sx={{
              backgroundColor: "#fff",
              padding: 3,
              borderRadius: "12px",
              width: "90%",
              maxWidth: 400,
              textAlign: "center",
            }}>
              <Typography sx={{ mb: 3, fontWeight: 600, color: "#2e3760" }}>
                All dropdown fields must be filled before revealing the answer.
              </Typography>
              <Button variant="contained" onClick={() => setShowNotAnsweredModal(false)} sx={{ backgroundColor: "#2e3760" }}>
                OK
              </Button>
            </Box>
          </Box>
        )}

      </Box>

      {/* Reveal Button */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleReveal}
          disabled={showReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: { xs: "0.5rem 2rem", md: "0.6rem 2.5rem" },
            borderRadius: "10px",
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
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={2}
            color="#2E3760"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
          >
            Answer Review
          </Typography>

          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: 2,
              overflow: "hidden",
              mb: 3,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left" }}>
                <th
                  style={{
                    padding: "10px 14px",
                    fontWeight: 600,
                    color: "#2E3760",
                    fontSize: "0.95rem",
                    width: "45%",
                  }}
                >
                  Your Answer
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    fontWeight: 600,
                    color: "#2E3760",
                    fontSize: "0.95rem",
                    width: "45%",
                  }}
                >
                  Correct Answer
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    fontWeight: 600,
                    color: "#2E3760",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    width: "10%",
                  }}
                >
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {dropdowns.map((dt, idx) => {
                const dropdownId = dt.id;
                const userVal = dropdownValues[dropdownId] || "Not selected";
                const backendAnswer = dt.dropdownanswer;
                const fallbackVal =
                  dt.dropdownoption?.find((opt) => opt.is_correct)
                    ?.dropdownValue || dt.dropdownoption?.[0]?.dropdownValue;
                const correctVal = backendAnswer ?? fallbackVal ?? "Not available";
                const isCorrectVal = String(userVal) === String(correctVal);

                return (
                  <tr
                    key={dropdownId ?? idx}
                    style={{
                      backgroundColor: isCorrectVal
                        ? "rgba(34,197,94,0.08)"
                        : "rgba(239,68,68,0.08)",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        color: isCorrectVal ? "green" : "red",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                      }}
                      dangerouslySetInnerHTML={{ __html: userVal || "" }}
                    />
                    <td
                      style={{
                        padding: "10px 14px",
                        color: "#16a34a",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                      }}
                      dangerouslySetInnerHTML={{ __html: correctVal || "" }}
                    />
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      {isCorrectVal ? "✅" : "❌"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={3}
            color={isCorrect ? "green" : "red"}
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              textAlign: "center",
            }}
          >
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </Typography>

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || "Explanation"}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={
              (question.additionalInfo || []).map((a) => a.info) || []
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

export default DropdownQuestionComponent;
