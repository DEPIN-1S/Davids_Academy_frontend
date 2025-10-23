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
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../features/exam/examSlice";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DropdownQuestionComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { questionData } = useSelector((state) => state.exam);
  const { questionId } = useParams();
  const [activeTab, setActiveTab] = useState("");

  const [dropdownValues, setDropdownValues] = useState({});
  const navigate = useNavigate();

  // Fetch question data
  useEffect(() => {
    if (questionId) dispatch(getQuestionData(questionId));
  }, [dispatch, questionId]);


  // Set default tab immediately after questionData loads
  useEffect(() => {
    if (questionData?.data?.tabsInfo?.length > 0) {
      setActiveTab(questionData.data.tabsInfo[0].tabKey);
    }
  }, [questionData]);


  // Initialize dropdown values
  useEffect(() => {
    const dropdowns = questionData?.data?.dropdowns || [];
    const initialValues = {};
    dropdowns.forEach((dt) => {
      if (dt?.id && dt?.blankOrNot === "1") {
        initialValues[dt.id] = "";
      }
    });
    setDropdownValues(initialValues);
  }, [questionData?.data?.dropdowns]);


  // Handlers
  const handleDropdownChange = (id) => (event) => {
    setDropdownValues((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  const handleTabClick = (tabKey) => setActiveTab(tabKey);
  // Render dropdown question text
  const renderFillInTheBlanks = () => {
    const dropdowns = questionData?.data?.dropdowns || [];

    return (
      <Box
        sx={{
          fontSize: "1.1rem",
          lineHeight: 1.8,
          textAlign: "left",
          p: 2,
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        {dropdowns.map((dt, index) => {
          if (!dt) return null;
          const dropdownId = dt.id || index;
          const blankOrNot = dt.blankOrNot === "1";

          return (
            <span key={dropdownId}>
              <span style={{ marginRight: blankOrNot ? "8px" : "4px" }}>
                {dt.dropdownField}
              </span>

              {blankOrNot && (
                <FormControl
                  sx={{
                    minWidth: 120,
                    "& .MuiOutlinedInput-root": {
                      height: "32px",
                      fontSize: "0.9rem",
                    },
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
                    {dt.dropdownoption?.map((opt, i) => (
                      <MenuItem key={i} value={opt.dropdownValue}>
                        {opt.dropdownValue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </span>
          );
        })}
      </Box>
    );
  };

  // Extract question info
  const q = questionData?.data || {};
  const tabsInfo = q.tabsInfo || [];
  console.log("tab info  ::: ", tabsInfo);


  return (
    <>
      {/* Question Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          p: 2,
        }}
      >
        <Typography>Mark: {q.marks}</Typography>
        <Typography>Difficulty: {q.difficulty}</Typography>
        <Typography>Type: {q.question_type}</Typography>
      </Box>

      {/* Question Text */}
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textAlign: "center", color: "#2e3760", py: 4 }}
      >
        {q.question}
      </Typography>


      {/* Tabs */}
      {tabsInfo.length > 0 && (
        <div className="tabs">
          {tabsInfo.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.tabKey ? "active" : ""
                }`}
              onClick={() => handleTabClick(tab.tabKey)}
            >
              {tab.tabKey}
            </button>
          ))}
        </div>
      )}


      {/* Tab Content */}
      <div className="note-box" style={{ marginTop: "1rem", textAlign: "center" }}>
        {tabsInfo.length > 0 && (
          <>
            {tabsInfo.find((t) => t.tabKey === activeTab)?.tabImage && (
              <img
               /*  src={`${process.env.BASE_URL}/${tabsInfo.find((t) => t.tabKey === activeTab)?.tabImage}`} */
               src={`https://lunarsenterprises.com:8002/${tabsInfo.find((t) => t.tabKey === activeTab)?.tabImage}`}

                alt="Exhibit"
                style={{
                  width: 500,
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />

            )}
            <Typography sx={{ textAlign: 'left' }} variant="body1">
              {tabsInfo.find((t) => t.tabKey === activeTab)?.tabValue}
            </Typography>
          </>
        )}
      </div>

      {/* Question instruction */}
      {q.instructions &&
        <Box sx={{ pb: "10px", py: 4, alignItems: "center", justifyContent: "center", textAlign: "center" }} >
          <Typography sx={{ fontWeight: 200 }} ><h4>Question Instruction</h4></Typography>
          <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 15, pt: 2 }}>
            {q.instructions}
          </Typography>
        </Box>
      }

      {/* Dropdown Content */}
      <Box sx={{ mb: 4, px: 3 }}>{renderFillInTheBlanks()}</Box>

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
};

export default DropdownQuestionComponent;
