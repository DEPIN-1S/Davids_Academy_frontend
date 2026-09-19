import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";
import { sanitizeExamHtml } from "../../utils/examHtml";

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/^\/+/, "");
  return `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${clean}`;
};

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const optionToRegex = (txt) => {
  const escaped = escapeRegExp(txt || "").replace(/\s+/g, "\\s+");
  return new RegExp(escaped, "gi");
};

const normalize = (str) =>
  (str || "")
    .toString()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const SentenceQuestionComponent = ({ question, onSubmit, submittedResult }) => {

  const {
    id: questionId,
    question: questionText,
    passage = "",
    tabsInfo = [],
    highlightOptions = [],
    highlightAnswers = [],
    explanation = [],
    additionalInfo = [],
    marks = 0,
    instructions = "",
  } = question || {};

  const [activeTab, setActiveTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const tabHtml = tabsInfo?.[0]?.tabValue || "";
  const sentenceText =
    passage ||
    (tabHtml
      ? tabHtml.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
      : questionText || "");

  const optionList = useMemo(
    () =>
      (highlightOptions || [])
        .map((o) => ({ id: o.id, text: o.options }))
        .filter((o) => o.text),
    [highlightOptions]
  );

  const correctIdSet = useMemo(() => {
    const answerTexts = new Set(
      (highlightAnswers || []).map((a) => normalize(a.answer))
    );
    const ids = optionList
      .filter((o) => answerTexts.has(normalize(o.text)))
      .map((o) => o.id);
    return new Set(ids);
  }, [highlightAnswers, optionList]);

  const handleToggle = (id) => {
    if (showAnswer) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleReveal = () => {
    if (submittedResult?.result) return;
    if (selectedIds.length === 0) {
      setShowNotAnsweredModal(true);
      return;
    }

    const selectedTexts = selectedIds
      .map((id) => optionList.find((o) => o.id === id)?.text || id)
      .filter(Boolean);

    const selectedSet = new Set(selectedIds);
    const correctIds = Array.from(correctIdSet);
    const correctSet = new Set(correctIds);
    const sameSize = selectedSet.size === correctSet.size;
    const allMatch =
      sameSize && Array.from(selectedSet).every((id) => correctSet.has(id));
    const mark = allMatch ? marks : 0;
    onSubmit?.(questionId, allMatch, mark, selectedTexts.join(", "));
    setUserAnswer(selectedTexts.join(", ") || "Not selected");
    setIsCorrect(allMatch);

    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get("testId");

    if (
      pathname === "/student/exam" &&
      (testId || searchParams.get("mode") === "question-bank")
    ) {
      console.log("inside sentence highlight mock test response submitting");

      const answers = selectedIds;
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
    setShowAnswer(true);
  };

  useEffect(() => {
    if (submittedResult?.result && submittedResult.answers?.length > 0) {
      try {
        const previousIds = submittedResult.answers
          .map((ans) => ans.answer)
          .filter(Boolean);

        // Debug log for previous IDs loaded
        console.log("Loaded previous sentence highlight IDs:", previousIds);

        setSelectedIds(previousIds);

        const correctIds = Array.from(correctIdSet);
        const selectedSet = new Set(previousIds);
        const correctSet = new Set(correctIds);
        const sameSize = selectedSet.size === correctSet.size;
        const allMatch =
          sameSize && Array.from(selectedSet).every((id) => correctSet.has(id));

        setIsCorrect(allMatch);
        setShowAnswer(true);

        // Set user answer text for display
        const selectedTexts = previousIds
          .map((id) => optionList.find((o) => o.id === id)?.text)
          .filter(Boolean);
        setUserAnswer(selectedTexts.join(", "));

        sessionStorage.setItem("hasAnswered", "true");
        sessionStorage.setItem("isRevealed", "true");
      } catch (error) {
        console.error("Could not parse previous sentence highlight answers:", error);
      }
    }
  }, [submittedResult, optionList, correctIdSet]);

  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
  }, [questionId]);

  if (!question || !optionList.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No sentence highlight question data available</Typography>
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
      {/* Title */}
      <Typography variant="h6"
        className="q-stem q-html"
        sx={{
          textAlign: "left",
          alignItems: "center",
          wordBreak: "break-word",
        }} component="div" fontWeight={700} mb={5} dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(questionText) }} />

      {/* Instructions */}
      {!!instructions && (
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
            sx={{ textAlign: "left", lineHeight: 1.6 }}
           dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(instructions) }} />
        </Box>
      )}

      {/* Tabs (HTML) */}
      {tabsInfo.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Tabs
              value={Math.min(activeTab, tabsInfo.length - 1)}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": { gap: 1 },
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
                  "&.Mui-selected": {
                    color: "#fff",
                    fontWeight: 600,
                    backgroundColor: "#2e3760",
                    border: "1px solid #2e3760",
                  },
                },
              }}
            >
              {tabsInfo.map((tab, i) => (
                <Tab key={tab?.id || i} label={tab?.tabKey || `Tab ${i + 1}`} />
              ))}
            </Tabs>
          </Box>

          <Box
            className="q-tabs-panel"
            sx={{
              borderRadius: "10px",
              p: 2,
              mb: 4,
              minHeight: "100px",
            }}
          >
            <Typography
              component="div"
              variant="body1"
              className="q-html"
              sx={{
                textAlign: "left",
                "& p": { margin: 0, mb: "0.5em" },
                "& p:last-child": { mb: 0 },
                "& *": { lineHeight: 1.6 , wordBreak: "break-word", overflowWrap: "anywhere" },
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeExamHtml(
                  tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue ||
                  "No content available"
                ),
              }}
            />
            {tabsInfo[activeTab]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={buildImageUrl(tabsInfo[activeTab].tabImage)}
                  alt="tab"
                  style={{ maxWidth: "100%", borderRadius: 8, height: "auto" }}
                />
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Clickable sentence */}
      <Typography variant="body1" fontWeight={500} textAlign="center" mb={2}>
        Click words/phrases to highlight the findings that meet the prompt.
      </Typography>

      <Box
        className="q-sentence-board"
        sx={{
          maxWidth: "950px",
          margin: "0 auto",
          mb: 4,
          p: "1rem",
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: "left" }}>
          {(() => {
            const s = sentenceText || "";
            if (!optionList.length) return s;

            const taken = Array(s.length).fill(false);
            const ranges = [];
            const sortedOpts = optionList
              .map((o) => ({ ...o, len: (o.text || "").length }))
              .sort((a, b) => b.len - a.len);

            sortedOpts.forEach((o) => {
              if (!o.text) return;
              const re = optionToRegex(o.text);
              let m;
              while ((m = re.exec(s)) !== null) {
                const start = m.index;
                const end = start + m[0].length;
                let overlap = false;
                for (let k = start; k < end; k++) {
                  if (taken[k]) {
                    overlap = true;
                    break;
                  }
                }
                if (overlap) continue;
                ranges.push({ id: o.id, start, end, text: s.slice(start, end) });
                for (let k = start; k < end; k++) taken[k] = true;
              }
            });

            if (!ranges.length) return s;

            ranges.sort((a, b) => a.start - b.start);
            const parts = [];
            let cur = 0;
            for (const r of ranges) {
              if (cur < r.start) parts.push({ type: "text", text: s.slice(cur, r.start) });
              parts.push({ type: "match", id: r.id, text: s.slice(r.start, r.end) });
              cur = r.end;
            }
            if (cur < s.length) parts.push({ type: "text", text: s.slice(cur) });

            return parts.map((item, i) => {
              if (item.type === "match") {
                // Flexible type matching for correct selected highlights
                const isSelected = selectedIds.some((id) => id.toString() === item.id.toString());
                const isCorrect = Array.from(correctIdSet).some(
                  (id) => id.toString() === item.id.toString()
                );
                let bg = "transparent";
                let color = "inherit";

                if (showAnswer) {
                  if (isCorrect) {
                    bg = "#e6f4ea";
                    color = "#1b7a3b";
                  } else if (isSelected) {
                    bg = "#ffecec";
                    color = "#c0392b";
                  }
                } else if (isSelected) {
                  bg = "#e0f7fa";
                  color = "#007b7f";
                }

                return (
                  <Box
                    component="span"
                    key={`match-${item.id}-${i}`}
                    onClick={() => !showAnswer && handleToggle(item.id)}
                    sx={{
                      cursor: showAnswer ? "default" : "pointer",
                      backgroundColor: bg,
                      color,
                      borderRadius: "4px",
                      px: 0.5,
                      py: 0.2,
                      mr: 0.25,
                      display: "inline-block",
                      "&:hover": showAnswer
                        ? {}
                        : { backgroundColor: isSelected ? "#d0eef0" : "#f0f0f0" },
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (!showAnswer && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleToggle(item.id);
                      }
                    }}
                  >
                    {item.text}
                  </Box>
                );
              }
              return (
                <Box component="span" key={`text-${i}`}>
                  {item.text}
                </Box>
              );
            });
          })()}
        </Typography>
      </Box>

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
              sx={{ mb: 3, fontSize: "1rem", fontWeight: 600, color: "#2e3760" }}
            >
              Please select at least one phrase before revealing the answer.
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

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            px: "2.5rem",
            py: "0.6rem",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#e0b000" },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#32b05a">
            Correct Answer:
          </Typography>
          <List dense>
            {Array.from(correctIdSet)
              .map((id) => optionList.find((o) => o.id === id)?.text)
              .filter(Boolean)
              .map((txt, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: txt || "" }} />} />
                </ListItem>
              ))}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#2E3760">
            Your Answer:
          </Typography>
          <List dense>
            {(userAnswer ? userAnswer.split(", ") : ["Not selected"]).map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: item || "" }} />} />
              </ListItem>
            ))}
          </List>

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || "Explanation"}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={buildImageUrl(additionalInfo?.[0]?.image)}
            isAnswerCorrect={isCorrect}
            submittedResult={submittedResult}
          />
        </Box>
      )}
    </Box>
  );
};

export default SentenceQuestionComponent;
