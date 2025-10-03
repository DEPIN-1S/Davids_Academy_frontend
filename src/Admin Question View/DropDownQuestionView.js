import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../features/exam/examSlice";
import { useParams } from "react-router-dom";

const DropdownQuestionComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);
  const { questionId } = useParams();

  const [activeTab, setActiveTab] = useState("");
  const [dropdownValues, setDropdownValues] = useState({});

  // 🔹 Fetch question data when component mounts
  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  useEffect(() => {
    console.log("Updated questionData in state:", questionData);
  }, [questionData]);

  // 🔹 Set default tab only once when data loads
  useEffect(() => {
    const firstTab = questionData?.data?.tabsInfo?.[0]?.tabKey;
    if (firstTab && !activeTab) {
      setActiveTab(firstTab);
    }
  }, [questionData?.data?.tabsInfo]);

  // 🔹 Initialize dropdown values from API data
  useEffect(() => {
    const dropdowns = questionData?.data?.dropdowns || [];
    if (!dropdowns.length) return;

    const initialValues = {};
    dropdowns.forEach((dt) => {
      if (dt?.id && dt?.blankOrNot === "1") {
        initialValues[dt.id] = "";
      }
    });
    setDropdownValues(initialValues);
  }, [questionData?.data?.dropdowns]);

  // Handle dropdown selection
  const handleDropdownChange = (id) => (event) => {
    setDropdownValues((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  // Handle tab change
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  // Render fill-in-the-blanks content
  const renderFillInTheBlanks = () => {
    const dropdowns = questionData?.data?.dropdowns || [];

    return (
      <Box sx={{
        fontSize: '1.1rem',
        lineHeight: 1.8,
        textAlign: 'left',
        p: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        {dropdowns.map((dt, index) => {
          if (!dt) return null;

          const dropdownId = dt.id || index;
          const dropdownField = dt.dropdownField || '';
          const blankOrNot = dt.blankOrNot === "1";
          const dropdownOptions = dt.dropdownoption || [];

          return (
            <span key={dropdownId} style={{ display: 'inline' }}>
              {/* Always show the dropdown field text */}
              <span style={{ marginRight: blankOrNot ? '8px' : '4px', marginBottom: '10px', display: 'inline-block' }}>
                {dropdownField}
              </span>

              {/* Show dropdown only if blankOrNot is "1" */}
              {blankOrNot && (
                <span style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  margin: '0 4px'
                }}>
                  <FormControl
                    sx={{
                      minWidth: 120,
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '0.9rem'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.8rem',
                        transform: 'translate(14px, 8px) scale(1)'
                      },
                      '& .MuiInputLabel-shrink': {
                        transform: 'translate(14px, -6px) scale(0.75)'
                      }
                    }}
                    size="small"
                  >
                    <InputLabel>Select</InputLabel>
                    <Select
                      value={dropdownValues[dropdownId] || ""}
                      label="Select"
                      onChange={handleDropdownChange(dropdownId)}
                    >
                      <MenuItem value="">
                        <em>Choose...</em>
                      </MenuItem>
                      {dropdownOptions.map((opt, optIndex) => (
                        <MenuItem
                          key={opt.id || optIndex}
                          value={opt.dropdownValue || `Option ${optIndex + 1}`}
                        >
                          {opt.dropdownValue || `Option ${optIndex + 1}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </span>
              )}

              {/* Add space after each item except the last one */}
              {index < dropdowns.length - 1 && ' '}
            </span>
          );
        })}
      </Box>
    );
  };

  // Extract data safely
  const questionText = questionData?.data?.question || "";
  const mark = questionData?.data?.marks || "";
  const difficulty = questionData?.data?.difficulty || "";
  const question_type = questionData?.data?.question_type || "";
  const tabsInfo = questionData?.data?.tabsInfo || [];
  const dropdowns = questionData?.data?.dropdowns || [];

  return (
    <>
      {/* Header Info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          p: 2,
        }}
      >
        <Typography>Mark : {mark}</Typography>
        <Typography>Difficulty : {difficulty}</Typography>
        <Typography>Question Type : {question_type}</Typography>
      </Box>

      {/* Question Text */}
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textAlign: "center", color: "#2e3760", pt:5 }}
      >
        {questionText}
      </Typography>

      {/* Main Box */}
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


        {/* Tabs */}
        <div className="tabs">
          {tabsInfo.map((tab) => (
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
          <p>{tabsInfo.find((t) => t.tabKey === activeTab)?.tabValue}</p>
        </div>

        {/* Fill in the Blanks Section */}


      </Box>

      <Box sx={{ mb: 4 }}>
        {renderFillInTheBlanks()}
      </Box>
    </>
  );
};

export default DropdownQuestionComponent;