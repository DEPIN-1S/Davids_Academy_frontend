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

const TableMultipleDropdownComponent = ({ question, onSubmit }) => {
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
    difficulty,
  } = question || {};

  // Initialize per-cell dropdownValues state keyed by `${rowIndex}-${colIndex}`
  const [dropdownValues, setDropdownValues] = useState({});
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState(() =>
    tabsInfo && tabsInfo.length ? tabsInfo[0].tabKey : ""
  );

  useEffect(() => {
    if (tabsInfo && tabsInfo.length) setActiveTab(tabsInfo[0].tabKey);
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

  // Handle reveal (submission and show answers) for multi-dropdown table
  const handleReveal = () => {
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
  };

  // Loading or no data state
  if (!question || !rows || !rows.length || !headers || !headers.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No table data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header row */}
      <Box sx={{ width: "100%", px: { xs: 2, md: 6 }, pt: 2, mb: 1 }}>
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
            Question Type : Table Dropdown
          </Typography>
        </Box>
      </Box>

      {/* Question Text */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          textAlign: "center",
          color: "#2e3760",
          pt: 3,
          fontSize: { xs: "1rem", md: "1.25rem" },
          mb: 1,
        }}
      >
        {questionText}
      </Typography>

      {/* Instructions */}
      {instructions && (
        <Typography
          sx={{
            textAlign: "center",
            color: "#4b5563",
            mb: 4,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {instructions}
        </Typography>
      )}

      {/* Tabs for Contextual Information */}
      {tabsInfo && tabsInfo.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              px: 1,
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
                  alignItems: "center",
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
              {tabsInfo.map((tab) => (
                <Tab
                  label={tab.tabKey}
                  value={tab.tabKey}
                  key={tab.id || tab.tabKey}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>
          <Box
            sx={{
              backgroundColor: "#f8f9ff",
              borderRadius: "10px",
              py: { xs: 2 },
              px: { xs: 3 },
              m: 2,
              minHeight: "100px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#333" }}>
              {tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue || ""}
            </Typography>
          </Box>
        </>
      )}

      {/* Table Container */}
      <Box sx={{ px: { xs: 2, md: 6 }, mb: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            maxWidth: { xs: "100%", md: 720 },
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Table sx={{ width: "100%", tableLayout: "fixed" }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f1f5f9",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  Client
                </TableCell>
                {headers.map((h, idx) => (
                  <TableCell
                    key={h + idx}
                    sx={{
                      fontWeight: 600,
                      color: "#475569",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {h}
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
                    sx={{ color: "#1f2937", borderBottom: "1px solid #e2e8f0" }}
                  >
                    {row.rowLabel}
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
                        sx={{ borderBottom: "1px solid #e2e8f0" }}
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
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          {Array.isArray(col.options) &&
                          col.options.length > 0 ? (
                            col.options.map((opt, i) => (
                              <MenuItem
                                key={opt + i}
                                value={opt}
                                sx={{ color: "#475569" }}
                              >
                                {opt}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="" disabled>
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
                    primary={row.rowLabel}
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
                        primary={`${
                          headers[col.colIndex] || `Col ${col.colIndex}`
                        }: ${userVal}`}
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
                    primary={row.rowLabel}
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
                      primary={`${
                        headers[col.colIndex] || `Col ${col.colIndex}`
                      }: ${col.answer || "-"}`}
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

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
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

export default TableMultipleDropdownComponent;
