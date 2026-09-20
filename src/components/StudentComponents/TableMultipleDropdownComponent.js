import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";
import { sanitizeExamHtml } from "../../utils/examHtml";


const TableMultipleDropdownComponent = ({ question, onSubmit, submittedResult }) => {
  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    headers = [],
    rows = [],
    explanation = [],
    additionalInfo = [],
    tabsInfo = [],
    instructions,
    marks,
  } = question || {};

  // Initialize per-cell dropdownValues state keyed by `${rowIndex}-${colIndex}`
  const [dropdownValues, setDropdownValues] = useState({});
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();


  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
    setActiveTab(0);
    setShowReveal(false);
  }, [questionId]);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!tabsInfo || !tabsInfo.length) {
      setActiveTab(0);
      return;
    }
    setActiveTab((prev) => Math.min(prev, tabsInfo.length - 1));
  }, [tabsInfo]);

  const handleTabChange = (_e, newVal) => setActiveTab(newVal);

  // Handle dropdown change
  const handleDropdownChange = (rowIdx, colIdx) => (event) => {
    if (showReveal) return; // Prevent changes after reveal
    const key = `${rowIdx}-${colIdx}`;
    setDropdownValues((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  useEffect(() => {
    // Handle both submission format AND previous navigation format
    const previousAnswers = submittedResult?.answers || submittedResult?.data?.rowsAnswer;

    if (submittedResult?.result && previousAnswers?.length > 0) {
      try {


        const newDropdownValues = {};

        // Format 1: Previous navigation - answers[{rowId, colIndex, answer}]
        if (previousAnswers[0]?.rowId !== undefined) {
          previousAnswers.forEach(ans => {
            const key = `${ans.rowId}-${ans.colIndex}`;
            if (ans.answer) {
              newDropdownValues[key] = ans.answer;
            }
          });
        }

        // Format 2: Submission format - rowsAnswer[{rowLabel, columns[{colIndex, selected}]}]
        else if (previousAnswers[0]?.columns) {
          previousAnswers.forEach((row, rIdx) => {
            row.columns.forEach(col => {
              const key = `${rIdx}-${col.colIndex}`;
              if (col.selected !== undefined) {
                newDropdownValues[key] = col.selected;
              }
            });
          });
        }


        setDropdownValues(newDropdownValues);

        // Calculate correctness
        let allCorrect = true;
        rows.forEach((row, rIdx) => {
          row.columns.forEach(col => {
            const key = `${rIdx}-${col.colIndex}`;
            const userVal = newDropdownValues[key];
            if (col.answer && userVal !== col.answer) {
              allCorrect = false;
            }
          });
        });

        setIsCorrect(allCorrect);
        setShowReveal(true);

        sessionStorage.setItem("hasAnswered", "true");
        sessionStorage.setItem("isRevealed", "true");
        setShowNotAnsweredModal(false);
      } catch (error) {
        console.error("Could not parse previous multi-dropdown answers:", error);
      }
    }
  }, [submittedResult, rows]);


  // Handle reveal (submission and show answers) for multi-dropdown table
  const handleReveal = () => {
    if (submittedResult?.result) return;
    const allFilled = rows.every((row, rIdx) =>
      row.columns.every((col) => {
        const key = `${rIdx}-${col.colIndex}`;
        return dropdownValues[key] && dropdownValues[key] !== "";
      })
    );

    if (!allFilled) {
      setShowNotAnsweredModal(true);
      return;
    }
    let allCorrect = true;
    const answersList = [];

    rows.forEach((row, rIdx) => {
      row.columns.forEach((col) => {
        const key = `${rIdx}-${col.colIndex}`;
        const userVal = dropdownValues[key] || null;
        const correctVal = col.answer || null;
        answersList.push({
          rowLabel: row.rowLabel,
          colIndex: col.colIndex,
          userVal,
          correctVal,
        });
        if (correctVal !== null && userVal !== correctVal) allCorrect = false;
      });
    });

    const userAnswerStr = answersList
      .map(
        (a) =>
          `${a.rowLabel}[col ${a.colIndex}]: ${a.userVal || "Not selected"}`
      )
      .join(" | ");

    const mark = allCorrect ? marks || 0 : 0;
    if (typeof onSubmit === "function")
      onSubmit(questionId, allCorrect, mark, userAnswerStr);

    setIsCorrect(allCorrect);
    setShowReveal(true);

    // ✅ API CALL - ONLY ON /student/exam?testId=XXX
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank')) {


      const rowsAnswer = rows.map((row, rIdx) => ({
        rowLabel: rIdx,
        columns: row.columns.map((col) => {
          const key = `${rIdx}-${col.colIndex}`;
          return {
            colIndex: col.colIndex,
            selected: dropdownValues[key] || ""
          };
        }),
      }));


      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type.toLowerCase(),
        test_id: testId,
        rowsAnswer,
      };

      dispatch(submitMockTestQuestionResponseThunk(payload));
    }


    sessionStorage.setItem("hasAnswered", "true");
    sessionStorage.setItem("isRevealed", "true");
  };

  // Loading or no data state
  if (!question || !rows || !rows.length || !headers || !headers.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "left" }}>
        <Typography>No table data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      px: { xs: 3, md: 5 },
      py: { xs: 3, md: 5 }
    }}>
      {/* Header row */}
      {/*  <Box sx={{ width: "100%", px: { xs: 2, md: 6 }, pt: 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
          <Typography>Mark : {marks || ""}</Typography>
          <Typography sx={{ textAlign: "center" }}>
            Difficulty : {difficulty || ""}
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            Question Type : Multi Dropdown
          </Typography>
        </Box>
      </Box> */}

      {/* Question Text */}
      <Typography
        component="div"
        variant="h6"
        fontWeight={700}
        className="q-stem q-html"
        sx={{
          textAlign: "left",
          alignItems: "center",
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
            }}
           dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(instructions) }} />
        </Box>
      )}

      {/* Tabs for Contextual Information */}
      {tabsInfo && tabsInfo.length > 0 && (
        <>
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
                "& .MuiTabs-flexContainer": {
                  gap: 2,
                  alignItems: "left",
                },
                "& .MuiTab-root": {
                  minHeight: 42,
                  minWidth: 120,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#334155",
                  backgroundColor: "#fff",
                  border: "1px solid #e6eaef",
                  padding: { xs: "8px 20px", md: "10px 26px" },
                  transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": {
                    backgroundColor: "#fafbfd",
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
                  label={tab.tabKey}
                  value={idx}
                  key={tab.id || idx}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(34, 211, 238, 0.08)",
              borderRadius: "10px",
              py: { xs: 2 },
              px: { xs: 3 },

              minHeight: "100px",
            }}
          >
            <Typography
              component="div"
              variant="body1"
              className="q-html"
              sx={{
                color: "var(--sf-text-soft)",
                '& p': { margin: 0, marginBottom: '0.5em' },
                '& p:last-child': { marginBottom: 0 },
                '& *': { lineHeight: 1.6 , wordBreak: "break-word", overflowWrap: "anywhere" },
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeExamHtml(tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue || "")
              }}
            />
            {tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[Math.min(activeTab, tabsInfo.length - 1)].tabImage.startsWith("http")
                      ? tabsInfo[Math.min(activeTab, tabsInfo.length - 1)].tabImage
                      : `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${tabsInfo[Math.min(activeTab, tabsInfo.length - 1)].tabImage}`
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

      {/* Table Container */}
      <Box sx={{ mb: 4, mt: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            borderRadius: "0.75rem",
            overflowX: "auto", overflowY: "hidden",
            maxWidth: { xs: "100%", md: 720 },
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Table sx={{ width: "100%", tableLayout: { xs: "auto", md: "fixed" } }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f1f5f9",
                }}
              >
                {headers.map((h, idx) => (
                  <TableCell
                    key={h + idx}
                    sx={{
                      fontWeight: 600,
                      color: "#475569",
                      borderBottom: "1px solid #e2e8f0",
                      width: { xs: "auto", md: `${100 / headers.length}%` },
                      wordBreak: "break-word",
                      minWidth: { xs: "140px", sm: "auto" },
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: h || "" }} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rIdx) => (
                <TableRow
                  key={row.rowLabel + rIdx}
                  sx={{ backgroundColor: "white" }}
                >
                  <TableCell
                    sx={{ 
                       color: "#f8fbff", 
                       borderBottom: "1px solid #e2e8f0",
                       wordBreak: "break-word",
                       minWidth: { xs: "140px", md: "auto" },
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: row.rowLabel || "" }} />
                  </TableCell>
                  {row.columns.map((col) => {
                    const key = `${rIdx}-${col.colIndex}`;
                    const userValue = dropdownValues[key] || "";
                    const correctVal = col.answer || null;
                    const isCorrectAnswer =
                      showReveal &&
                      correctVal !== null &&
                      userValue === correctVal;
                    const isWrongAnswer =
                      showReveal &&
                      userValue &&
                      correctVal !== null &&
                      userValue !== correctVal;
                    return (
                      <TableCell
                        key={key}
                        sx={{ borderBottom: "1px solid #e2e8f0", minWidth: { xs: "160px", sm: "auto" } }}
                      >
                        <Select
                          value={userValue}
                          onChange={handleDropdownChange(rIdx, col.colIndex)}
                          disabled={showReveal}
                          displayEmpty
                          fullWidth
                          sx={{
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            height: 44,
                            backgroundColor: showReveal
                              ? isCorrectAnswer
                                ? "#e6f4ea"
                                : isWrongAnswer
                                  ? "#ffecec"
                                  : "white"
                              : "white",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            ".MuiSelect-select": {
                              color: showReveal
                                ? isCorrectAnswer
                                  ? "#1b7a3b"
                                  : isWrongAnswer
                                    ? "#c0392b"
                                    : "#475569"
                                : "#475569",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            },
                          }}
                        >
                          <MenuItem value="" sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                            <em>Select</em>
                          </MenuItem>
                          {Array.isArray(col.options) &&
                            col.options.length > 0 ? (
                            col.options.map((opt, i) => (
                              <MenuItem
                                key={opt + i}
                                value={opt}
                                sx={{ color: "#475569", whiteSpace: "normal", wordBreak: "break-word" }}
                              >
                                <div dangerouslySetInnerHTML={{ __html: opt || "" }} />
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="" disabled sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                              <em>No options</em>
                            </MenuItem>
                          )}
                        </Select>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


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
                sx={{ mb: 3, fontSize: "1rem", fontWeight: 600, color: "#2e3760" }}
              >
                All dropdown fields must be filled before revealing the answer.
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

      {/* Submit Button */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: { xs: "0.5rem 1.25rem", md: "0.6rem 2.5rem" },
            borderRadius: "10px",
            fontSize: { xs: "0.9rem", md: "1rem" },
            "&:hover": { backgroundColor: "#e0b000" },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showReveal && (
        <Box sx={{ mt: 2, px: { xs: 2, md: 6 }, mb: 6 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            color="#2E3760"
          >
            Your Answers
          </Typography>

          <List dense>
            {rows.map((row, rIdx) => (
              <React.Fragment key={row.rowLabel + rIdx}>
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<div dangerouslySetInnerHTML={{ __html: row.rowLabel || "" }} />}
                    primaryTypographyProps={{ sx: { fontWeight: 700 } }}
                  />
                </ListItem>
                {row.columns.map((col) => {
                  const key = `${rIdx}-${col.colIndex}`;
                  const userVal = dropdownValues[key] || "Not selected";
                  const correctVal = col.answer || null;
                  const isCellCorrect =
                    correctVal !== null && userVal === correctVal;
                  return (
                    <ListItem key={key} disablePadding sx={{ pl: 3 }}>
                      <ListItemText
                        primary={<div dangerouslySetInnerHTML={{ __html: `${headers[col.colIndex] || `Col ${col.colIndex}`}: ${userVal}` }} />}
                        primaryTypographyProps={{
                          sx: {
                            color: isCellCorrect
                              ? "green"
                              : correctVal !== null
                                ? "red"
                                : "#374151",
                            fontWeight: 500,
                          },
                        }}
                      />
                    </ListItem>
                  );
                })}
              </React.Fragment>
            ))}
          </List>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color="#35b564ff"
          >
            Correct Answers
          </Typography>
          <List dense>
            {rows.map((row, rIdx) => (
              <React.Fragment key={"correct-" + row.rowLabel + rIdx}>
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<div dangerouslySetInnerHTML={{ __html: row.rowLabel || "" }} />}
                    primaryTypographyProps={{ sx: { fontWeight: 700 } }}
                  />
                </ListItem>
                {row.columns.map((col) => (
                  <ListItem
                    key={"c-" + rIdx + "-" + col.colIndex}
                    disablePadding
                    sx={{ pl: 3 }}
                  >
                    <ListItemText
                      primary={<div dangerouslySetInnerHTML={{ __html: `${headers[col.colIndex] || `Col ${col.colIndex}`}: ${col.answer || "-"}` }} />}
                      primaryTypographyProps={{
                        sx: {
                          color: col.answer ? "green" : "#374151",
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </React.Fragment>
            ))}
          </List>

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

export default TableMultipleDropdownComponent;
