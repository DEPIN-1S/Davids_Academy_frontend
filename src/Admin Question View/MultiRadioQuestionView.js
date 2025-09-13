import React, { useEffect, useState } from "react";
import QuestionHeader from "./QuestionHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionData } from "../features/exam/examSlice";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MultiRadioQuestionView() {
  // 🔹 Static Question Data
  const { questionId } = useParams()
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);
  const navigate = useNavigate();

  useEffect(() => {
    if (questionId) {
      console.log("Dispatching thunk with questionId:", questionId);
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);
  useEffect(() => {
    console.log("Updated RadiquestionData in state:", questionData);
  }, [questionData]);


  useEffect(() => {
    if (questionData?.data?.tabsInfo?.length > 0) {
      // set first tab as active by default
      setActiveTab(questionData.data.tabsInfo[0].tabKey);
    }
  }, [questionData]);

  const question = {
    question: "Which intervention should the nurse take first?",
    tabsInfo: [
      { tabKey: "History", tabValue: "Patient has history of asthma and hypertension." },
      { tabKey: "Assessment", tabValue: "Patient presents with shortness of breath and wheezing." },
      { tabKey: "Labs", tabValue: "O2 saturation: 85%, BP: 140/90 mmHg." },
    ],
    clientfindings: [
      { id: 1, client_findings: "Shortness of breath" },
      { id: 2, client_findings: "Wheezing" },
      { id: 3, client_findings: "High blood pressure" },
    ],
    radioOption: [
      { answer: "Priority" },
      { answer: "Secondary" },
      { answer: "Not Relevant" },
    ],
    explanation: [
      { heading: "Explanation", explanation: "Oxygen therapy should be the first priority to stabilize the patient." },
    ],
    additionalInfo: [
      { info: "Asthma exacerbations require immediate airway support.", image: "/images/asthma.png" },
    ],
  };

  const [activeTab, setActiveTab] = useState(question.tabsInfo[0].tabKey);
  const [answers, setAnswers] = useState({});
  const [showReveal, setShowReveal] = useState(false);

  // Extract static data
  const notesTabs = question.tabsInfo.map((tab) => tab.tabKey);
  const clientFindings = question.clientfindings;
  const answerGroups = Array.from(new Set(question.radioOption.map((opt) => opt.answer)));

  const tabContent = question.tabsInfo.reduce((acc, tab) => {
    acc[tab.tabKey] = tab.tabValue;
    return acc;
  }, {});

  const explanationHeading = question.explanation[0]?.heading || "Explanation";
  const explanationParagraphs = question.explanation.map((exp) => exp.explanation);
  const additionalInfoParagraphs = question.additionalInfo.map((info) => info.info);
  const additionalInfoImage = question.additionalInfo[0]?.image || null;
  const mark = questionData.data.marks;
  const difficulty = questionData.data.difficulty;
  const question_type = questionData.data.question_type;
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleSelect = (findingIndex, group) => {
    setAnswers((prev) => ({ ...prev, [findingIndex]: group }));
  };

  const handleReveal = () => {
    setShowReveal(true);
  };

  return (
    <>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        pb: 2,
      }} >
        <Typography >
          Mark :{mark}
        </Typography>
        <Typography >
          Difficulty :{difficulty}
        </Typography>
        <Typography >
          Question Type : {question_type}
        </Typography>
      </Box>
      {/*  <QuestionHeader  /> */}
      <div className="multi-radio-container">

        <div className="heading">
          <h4> {questionData?.data?.question}</h4>
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
          <p>
            {
              questionData?.data?.tabsInfo?.find((t) => t.tabKey === activeTab)
                ?.tabValue
            }
          </p>
        </div>


        {/* Radio Table */}
        <div className="table-wrapper">
          <table className="radio-table">
            <thead>
              <tr>
                <th>Client findings</th>
                {answerGroups.map((group) => (
                  <th key={group}>{group}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientFindings.map((finding, idx) => (
                <tr key={finding.id || idx}>
                  <td>{finding.client_findings}</td>
                  {answerGroups.map((group) => (
                    <td key={group}>
                      <input
                        type="radio"
                        name={`finding-${idx}`}
                        value={group}
                        checked={answers[idx] === group}
                        onChange={() => handleSelect(idx, group)}
                        disabled={showReveal}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reveal Answer Button */}
        {/*  {!showReveal && (
        <div className="reveal-btn-wrap">
          <button className="reveal-btn" onClick={handleReveal}>
            Reveal Answer
          </button>
        </div>
      )} */}

        {/* Reveal Answer Section */}
        {/* {showReveal && (
        <RevealAnswerComponent
          questionText={question.question}
          explanationHeading={explanationHeading}
          explanationParagraphs={explanationParagraphs}
          additionalInfoHeading="Additional Info"
          additionalInfoParagraphs={additionalInfoParagraphs}
          additionalInfoImage={additionalInfoImage}
        />
      )} */}
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
      </div>
    </>
  );
}

export default MultiRadioQuestionView;
