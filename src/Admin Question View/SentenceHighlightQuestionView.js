import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data, useNavigate, useParams } from "react-router-dom";
import { getQuestionData } from "../../src/features/exam/examSlice"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button } from "@mui/material";

function SentenceHighlightQuestionView() {
  const notesTabs = [
    "History and Physical",
    "Laboratory Results",
    "Physicians Orders",
    "Progress Note",
  ];



  const sentencesData = [
    "The client presents six weeks following the initiation of levothyroxine.",
    'The client reports that "she feels better but not 100%."',
    "She indicates that she is going outdoors more often and engaging with friends.",
    "She said she is still gaining weight and experiencing constipation.",
    "On exam, the client is alert and oriented. She reports that her mood is 'good' and has a cheerful affect.",
    "Trace pedal edema was noted with 2+ peripheral pulses at a rate of 64/minute.",
    "Hypoactive bowel in all quadrants sounds with abdominal distention.",
  ];

  // ✅ Hooks go here
  const [activeTab, setActiveTab] = useState("Triage Note");
  const [selectedSentences, setSelectedSentences] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const { questionId } = useParams()
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
    console.log("Updated sentence highlight questionData in state:", questionData);
  }, [questionData]);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };
  const tabContent = questionData?.data?.tabsInfo?.reduce((acc, tab) => {
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

  return (
    <>
      <div className="heading">
        <h4>
          <h4> {questionData?.data?.question}</h4>
        </h4>
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
      <div className="highlight-question-wrapper">
        <p className="highlight-instruction">
          Click to highlight the findings in the progress note that indicate
          that the client is not meeting the treatment goals.
        </p>

        <div className="highlight-scroll-box">
          {sentencesData.map((sentence, idx) => (
            <p
              key={idx}
              className={`highlight-sentence ${selectedSentences.includes(sentence) ? "highlighted" : ""
                }`}
              onClick={() => handleToggleSentence(sentence)}
            >
              {sentence}
            </p>
          ))}
        </div>

        <div className="reveal-btn-wrap">
          <button
            className="reveal-btn"
            onClick={() => setShowExplanation(true)}
          >
            Reveal Answer
          </button>
        </div>

        {showExplanation && (
          <div className="highlight-explanation-box">
            <h3>Explanation</h3>
            <ul>
              <li>
                Still gaining weight and experiencing constipation indicates
                hypothyroidism persists.
              </li>
              <li>
                Hypoactive bowel sounds and abdominal distention reflect poor GI
                motility.
              </li>
              <li>
                Trace pedal edema and reduced activity tolerance are clinical
                concerns.
              </li>
            </ul>
          </div>
        )}
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)} // 👈 goes back
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
