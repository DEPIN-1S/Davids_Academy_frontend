import React, { useEffect, useState } from "react";
import QuestionHeader from "./QuestionHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionData } from "../features/exam/examSlice";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MultiRadioQuestionView() {
  const { questionId } = useParams();
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("");
  const [answers, setAnswers] = useState({});
  const [showReveal, setShowReveal] = useState(false);

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

  const mark = questionData?.data?.marks || "";
  const difficulty = questionData?.data?.difficulty || "";
  const question_type = questionData?.data?.question_type || "";
  const questionText = questionData?.data?.question || "";
  const radioOption = questionData?.data?.radioOption || [];
  const questionContent = questionData?.data?.questionContent || [];
  const answerGroups = Array.from(new Set(radioOption.map((opt) => opt.options)));

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleSelect = (findingIndex, group) => {
    setAnswers((prev) => ({ ...prev, [findingIndex]: group }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          pb: 2,
        }}
      >
        <Typography>Mark : {mark}</Typography>
        <Typography>Difficulty : {difficulty}</Typography>
        <Typography>Question Type : {question_type}</Typography>
      </Box>
      {/*  <QuestionHeader /> */}
      <div className="multi-radio-container">
        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
          sx={{ textAlign: "center", color: "#2e3760", pt: 4 }}
         dangerouslySetInnerHTML={{ __html: questionText || "" }} />



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
          {(() => {
            const activeTabData = questionData?.data?.tabsInfo?.find(
              (t) => t.tabKey === activeTab
            );

            if (!activeTabData) return null;

            return (
              <Box sx={{ textAlign: "center", py: 2 }}>
                {activeTabData?.tabImage && (
                  <img
                    src={`${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${activeTabData.tabImage}`}
                    alt="Tab Image"
                    style={{ maxWidth: "100%", width: 500, borderRadius: 8, marginBottom: 8 }}
                  />
                )}
                <Typography
                  sx={{
                    textAlign: 'left',
                    // Optional: Clean up default <p> margins for better spacing
                    '& p': { margin: 0, marginBottom: '0.5em' },
                    '& p:last-child': { marginBottom: 0 },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: activeTabData?.tabValue || ''
                  }}
                />
              </Box>
            );
          })()}
        </div>

        {questionData?.data?.instructions &&
          <Box sx={{ pb: "10px", py: 4, alignItems: "center", justifyContent: "center", textAlign: "center" }} >
            <Typography sx={{ fontWeight: 200 }} ><h4>Question Instruction</h4></Typography>
            <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 15, pt: 2 }} dangerouslySetInnerHTML={{ __html: questionData?.data?.instructions || "" }} />
          </Box>
        }

        {/* Radio Table */}
        <div className="table-wrapper">
          <table className="radio-table">
            <thead>
              <tr>
                <th>{questionData?.data?.multiradioHeading}</th>
                {answerGroups.map((group) => (
                  <th key={group}>{group}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questionContent.map((finding, idx) => (
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
