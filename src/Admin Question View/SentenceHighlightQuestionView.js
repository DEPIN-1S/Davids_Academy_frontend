import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionData } from "../../src/features/exam/examSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";

function SentenceHighlightQuestionView() {
  const [activeTab, setActiveTab] = useState("");
  const [selectedSentences, setSelectedSentences] = useState([]);
  const { questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { questionData, loading, error } = useSelector((state) => state.exam);

  useEffect(() => {
    if (questionId) {
      console.log("Dispatching thunk with questionId:", questionId);
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  useEffect(() => {
    if (questionData?.data?.tabsInfo?.length > 0) {
      setActiveTab(questionData.data.tabsInfo[0].tabKey);
    }
  }, [questionData]);

  const mark = questionData?.data?.marks || "";
  const difficulty = questionData?.data?.difficulty || "";
  const question_type = questionData?.data?.question_type || "";

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const tabContent =
    questionData?.data?.tabsInfo?.reduce((acc, tab) => {
      acc[tab.tabKey] = tab.tabValue;
      return acc;
    }, {}) || {};

  const handleToggleSentence = (sentence) => {
    if (selectedSentences.includes(sentence)) {
      setSelectedSentences(selectedSentences.filter((s) => s !== sentence));
    } else {
      setSelectedSentences([...selectedSentences, sentence]);
    }
  };

  // ✅ Highlight passage with clickable spans
  const renderHighlightedPassage = () => {
    const passage = questionData?.data?.passage || "";
    const highlightOptions =
      questionData?.data?.highlightOptions?.map((opt) => opt.options) || [];

    if (!passage) return null;

    // Split passage by highlightable phrases
    let highlighted = passage;
    highlightOptions.forEach((option) => {
      const regex = new RegExp(`(${option})`, "gi");
      highlighted = highlighted.replace(
        regex,
        `@@HIGHLIGHT_START@@$1@@HIGHLIGHT_END@@`
      );
    });

    const parts = highlighted.split(/(@@HIGHLIGHT_START@@|@@HIGHLIGHT_END@@)/g);

    let isHighlight = false;
    return parts.map((part, index) => {
      if (part === "@@HIGHLIGHT_START@@") {
        isHighlight = true;
        return null;
      }
      if (part === "@@HIGHLIGHT_END@@") {
        isHighlight = false;
        return null;
      }

      if (isHighlight) {
        const isSelected = selectedSentences.includes(part);
        return (
          <span
            key={index}
            onClick={() => handleToggleSentence(part)}
            style={{
              backgroundColor: isSelected ? "#ffcc80" : "#fff59d", // orange vs light yellow
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: "4px",
              margin: "0 2px",
            }}
          >
            {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          p: 2,
          pb: 8,
        }}
      >
        <Typography>Mark : {mark}</Typography>
        <Typography>Difficulty : {difficulty}</Typography>
        <Typography>Question Type : {question_type}</Typography>
      </Box>

      <div className="heading">
        <h4>{questionData?.data?.question}</h4>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {questionData?.data?.tabsInfo?.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.tabKey ? "active" : ""}`}
            onClick={() => handleTabClick(tab.tabKey)}
          >
            {tab.tabKey}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="note-box">
        <p>{tabContent[activeTab]}</p>
      </div>

      {/* Highlight Section */}
      {/* Highlight Section */}
      <div className="highlight-question-wrapper" style={{ marginTop: "20px" }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 2, color: "#444" }}
        >
          Click to highlight the findings in the progress note that indicate
          the client is not meeting the treatment goals:
        </Typography>

        <div
          className="highlight-scroll-box"
          style={{
            backgroundColor: "#fafafa",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "16px 20px",
            lineHeight: "1.8",
            maxHeight: "280px",
            overflowY: "auto",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontSize: "1rem", color: "#333", whiteSpace: "pre-line" }}
          >
            {renderHighlightedPassage()}
          </Typography>
        </div>
      </div>


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
    </>
  );
}

export default SentenceHighlightQuestionView;
