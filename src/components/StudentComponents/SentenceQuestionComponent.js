import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";

const SentenceQuestionComponent = ({ question, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    passage = "",
    tabsInfo = [],
    highlightOptions = [], // Updated to match API: highlightOptions
    answer: correctAnswerStr = "",
    explanation = [],
    additionalInfo = [],
  } = question || {};

  // Prefer `passage` (API) for the sentence to render; fall back to `question` text
  const sentenceText = passage || questionText || "";

  const [activeTab, setActiveTab] = useState(0);
  const [selectedSentences, setSelectedSentences] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle sentence selection by option id
  const handleToggleSentence = (optionId) => {
    if (selectedSentences.includes(optionId)) {
      setSelectedSentences(selectedSentences.filter((s) => s !== optionId));
    } else {
      setSelectedSentences([...selectedSentences, optionId]);
    }
  };

  // Handle reveal (submission and show answers)
  const handleReveal = () => {
    // User’s selected sentences as a comma-separated string (map ids -> text)
    const userAnswerStr =
      selectedSentences.length > 0
        ? selectedSentences
          .map(
            (id) => highlightOptions.find((o) => o.id === id)?.options || id
          )
          .join(", ")
        : "Not selected";

    // Build correct answer ids from correctAnswerStr (e.g., "12" -> indices [0,1])
    const correctIndices = (correctAnswerStr || "")
      .toString()
      .split("")
      .map(Number)
      .filter((n) => !Number.isNaN(n))
      .map((i) => i - 1);

    const correctAnswerIds = correctIndices
      .map((idx) => highlightOptions[idx]?.id)
      .filter((id) => id !== undefined);

    const correctAnswerList = correctAnswerIds.map(
      (id) =>
        highlightOptions.find((o) => o.id === id)?.options || "Not available"
    );
    const correctAnswerText = correctAnswerList.join(", ") || "Not available";

    // Compare user selections (ids) with correct answer ids (order-independent)
    const setsEqual = (a, b) =>
      a.length === b.length && a.every((v) => b.includes(v));
    const correctStatus = setsEqual(
      selectedSentences.sort(),
      correctAnswerIds.sort()
    );
    const mark = correctStatus ? question?.marks || 5 : 0;

    // Call onSubmit from ExamContainer
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    // Set states for reveal
    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerText);
    setIsCorrect(correctStatus);
    setShowAnswer(true);
  };

  // Loading or no data state
  if (!question || !highlightOptions.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No sentence highlight question data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "1.5rem",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "950px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Question Text */}
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        {questionText}
      </Typography>

      {/* Tabs for Contextual Information */}

      {tabsInfo.length > 0 && (
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
              value={Math.min(activeTab, tabsInfo.length - 1)}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                sx: { display: "none" },
              }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
                "& .MuiTab-root": {
                  minHeight: 42,
                  minWidth: 110,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#475569",
                  border: "1px solid #e6eaef",
                  padding: { xs: "7px 18px", md: "8px 24px" },
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
              {tabsInfo.map((tab, i) => (
                <Tab
                  key={tab?.id || i}
                  label={tab?.tabKey || `Tab ${i + 1}`}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>
          <Box
            sx={{
              backgroundColor: "#f8f9ff",
              borderRadius: "10px",
              padding: "1rem",
              mb: 4,
              minHeight: "100px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#333" }}>
              {tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue ||
                "No content available"}
            </Typography>
            {tabsInfo[activeTab]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[activeTab].tabImage.startsWith("http")
                      ? tabsInfo[activeTab].tabImage
                      : `${'https://lunarsenterprises.com:6040/'}${tabsInfo[activeTab].tabImage}`
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

      {/* Inline sentence with clickable highlighted options */}
      <Typography variant="body1" fontWeight={500} textAlign="center" mb={2}>
        Click words/phrases in the sentence to highlight the findings that
        indicate the client is not meeting the treatment goals.
      </Typography>
      <Box
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          mb: 4,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {(() => {
            // Use sentenceText (passage or question) and options with ids
            const s = sentenceText || "";
            const options = highlightOptions
              .map((o) => ({ id: o.id, text: o.options }))
              .filter((o) => o.text);
            if (!options.length) return s;

            const normalize = (str) =>
              str
                .toString()
                .toLowerCase()
                .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
                .replace(/[.,/#!$%^&*;:{}=\-_`~()"?<>\[\]\n\r]/g, "")
                .replace(/\s+/g, " ")
                .trim();

            const normalizedSentence = normalize(s);

            // Sort options by normalized length desc to prefer longer matches
            const normalizedOptions = options
              .map((o) => ({
                id: o.id,
                raw: o.text,
                norm: normalize(o.text),
              }))
              .sort((a, b) => b.norm.length - a.norm.length);

            // Find matches without overlapping
            const taken = Array(s.length).fill(false);
            const matches = [];
            normalizedOptions.forEach((opt) => {
              if (!opt.norm) return;
              let startIndex = 0;
              while (true) {
                const foundIndex = normalizedSentence.indexOf(
                  opt.norm,
                  startIndex
                );
                if (foundIndex === -1) break;
                // Map foundIndex in normalizedSentence to index in original s by searching case-insensitively
                const origIndex = s.toLowerCase().indexOf(opt.norm, startIndex);
                if (origIndex === -1) {
                  startIndex = foundIndex + 1;
                  continue;
                }
                const end = origIndex + opt.norm.length;
                // check overlap
                let overlap = false;
                for (let k = origIndex; k < end; k++) {
                  if (taken[k]) {
                    overlap = true;
                    break;
                  }
                }
                if (!overlap) {
                  matches.push({
                    id: opt.id,
                    start: origIndex,
                    length: opt.norm.length,
                    text: s.substr(origIndex, opt.norm.length),
                  });
                  for (let k = origIndex; k < end; k++) taken[k] = true;
                }
                startIndex = foundIndex + 1;
              }
            });

            if (!matches.length) return s;

            // Sort matches by start
            matches.sort((a, b) => a.start - b.start);

            // Build parts
            const built = [];
            let cursor = 0;
            matches.forEach((m) => {
              if (cursor < m.start)
                built.push({ type: "text", text: s.slice(cursor, m.start) });
              built.push({
                type: "match",
                id: m.id,
                text: s.slice(m.start, m.start + m.length),
              });
              cursor = m.start + m.length;
            });
            if (cursor < s.length)
              built.push({ type: "text", text: s.slice(cursor) });

            // compute correct answer ids from correctAnswerStr for coloring after reveal
            const parsedCorrectIndices = (correctAnswerStr || "")
              .toString()
              .split("")
              .map(Number)
              .filter((n) => !Number.isNaN(n))
              .map((i) => i - 1);
            const parsedCorrectIds = parsedCorrectIndices
              .map((idx) => highlightOptions[idx]?.id)
              .filter((id) => id !== undefined);

            return built.map((item, i) => {
              if (item.type === "match") {
                const isSelected = selectedSentences.includes(item.id);
                const isCorrectOption = parsedCorrectIds.includes(item.id);
                // determine styling depending on reveal state
                let bg = isSelected ? "#e0f7fa" : "transparent";
                let color = isSelected ? "#007b7f" : "inherit";
                if (showAnswer) {
                  if (isCorrectOption) {
                    bg = "#e6f4ea"; // light green
                    color = "#1b7a3b";
                  } else if (isSelected && !isCorrectOption) {
                    bg = "#ffecec"; // light red
                    color = "#c0392b";
                  } else {
                    bg = "transparent";
                    color = "inherit";
                  }
                }

                return (
                  <Box
                    component="span"
                    key={`match-${item.id}-${i}`}
                    onClick={() => {
                      if (showAnswer) return;
                      handleToggleSentence(item.id);
                    }}
                    sx={{
                      cursor: showAnswer ? "default" : "pointer",
                      backgroundColor: bg,
                      color: color,
                      borderRadius: "4px",
                      px: 0.5,
                      py: 0.2,
                      mr: 0.25,
                      display: "inline-block",
                      "&:hover": showAnswer
                        ? {}
                        : {
                          backgroundColor: isSelected ? "#d0eef0" : "#f0f0f0",
                        },
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (showAnswer) return;
                        e.preventDefault();
                        handleToggleSentence(item.id);
                      }
                    }}
                  >
                    {item.text}
                  </Box>
                );
              }
              return (
                <Box component="span" key={`text-${i}`}>
                  {" "}
                  {item.text}{" "}
                </Box>
              );
            });
          })()}
        </Typography>
      </Box>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: "0.6rem 2.5rem",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#e0b000",
            },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            color="#32b05aff"
          >
            Correct Answer:
          </Typography>
          <List dense>
            {correctAnswer.split(", ").map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color="#2E3760"
          >
            Your Answer:
          </Typography>
          <List dense>
            {userAnswer.split(", ").map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
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
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `https://lunarsenterprises.com:6040/${question.additionalInfo[0].image}`
                : null
            }

          />
        </Box>
      )}
    </Box>
  );
};

export default SentenceQuestionComponent;
