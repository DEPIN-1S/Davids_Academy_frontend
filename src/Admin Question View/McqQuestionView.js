import React, { useEffect, useState } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button, Tab, Tabs, } from '@mui/material';
import { getQuestionData } from "../features/exam/examSlice"
import '../styles/DashboardStyles/RadioButtonQuestionComponent.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
function McqQuestionView() {
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const { questionId } = useParams()
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);
  console.log("Question id in params", questionId);

  const navigate = useNavigate();
  useEffect(() => {
    if (questionId) {
      console.log("Dispatching thunk with questionId:", questionId);
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  useEffect(() => {
    console.log("Updated questionData in state:", questionData);
  }, [questionData]);

  const questionText = questionData?.data?.question || "";
  const mark = questionData?.data?.marks || "";
  const difficulty = questionData?.data?.difficulty || "";
  const question_type = questionData?.data?.question_type || "";
  const mcqoptions = questionData?.data?.mcqoptions || [];
  const exhibit = questionData?.data?.exhibit;
  const [activeTab, setActiveTab] = useState("");

  const tabsInfo = questionData?.data?.tabsInfo || [];
  const handleTabChange = (_event, newTab) => {
    setActiveTab(newTab);
  };
  console.log("tf:::", tabsInfo);


  // set default active tab when tabsInfo loads
  useEffect(() => {
    const firstTabKey = tabsInfo?.[0]?.tabKey;
    if (firstTabKey && !activeTab) {
      setActiveTab(firstTabKey);
    }
  }, [tabsInfo]);



  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };


  return (
    <>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        p: 2,
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

      <Box sx={{
        width: "full",
        alignItems: "center",
        justifyContent: "center"
      }} >

        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
          sx={{ textAlign: "center", color: "#2e3760", pt: 4 }}
        >
          {questionText}
        </Typography>

        <Box>

          <Box className="exhibit-img" >
            {questionData?.data?.exhibit && (
              <img
                width={400}
                src={`https://lunarsenterprises.com:6040/${exhibit}`}

                alt="Exhibit"
                style={{ maxWidth: '100%', marginBottom: '1rem', borderRadius: 8 }}
              />
            )}
          </Box>


          {/* Tabs */}
          {tabsInfo?.length > 0 && (
            <>
              {/* Tab Buttons */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2, px: 1 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  TabIndicatorProps={{ sx: { display: "none" } }}
                  sx={{
                    "& .MuiTab-root": {
                      borderRadius: "999px",
                      textTransform: "none",
                      backgroundColor: "#fff",
                      border: "1px solid #e6eaef",
                      marginRight: "8px",
                      "&.Mui-selected": {
                        backgroundColor: "#2e3760",
                        color: "#fff",
                      },
                    },
                  }}
                >
                  {tabsInfo.map((tab) => (
                    <Tab
                      key={tab.id ?? tab.tabKey}
                      label={tab.tabKey}
                      value={tab.tabKey}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box
                sx={{
                  backgroundColor: "#f8f9ff",
                  borderRadius: "10px",
                  py: 3,
                  px: 3,
                  m: 2,
                  minHeight: "120px",
                  textAlign: "center", // ✅ center everything
                }}
              >
                {(() => {
                  const activeTabData = tabsInfo.find((t) => t.tabKey === activeTab);
                  if (!activeTabData) return null;

                  return (
                    <>
                      {activeTabData?.tabImage && (
                        <img
                          src={`https://lunarsenterprises.com:6040/${activeTabData.tabImage}`}
                          alt="tabImage"
                          style={{
                            display: "block", // ✅ center image
                            margin: "0 auto 16px",
                            width: 500,
                            maxWidth: "100%", // responsive
                            borderRadius: 8,
                          }}
                        />
                      )}
                      <Typography variant="body1" sx={{ color: "#333", textAlign: 'left' }}>
                        {activeTabData?.tabValue || ""}
                      </Typography>
                    </>
                  );
                })()}
              </Box>
            </>
          )}

          {questionData?.data?.instructions &&
            <Box sx={{ pb: "10px", py: 4, alignItems: "center", justifyContent: "center", textAlign: "center" }} >
              <Typography sx={{ fontWeight: 200 }} ><h4>Question Instruction</h4></Typography>
              <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 15, pt: 2 }}>
                {questionData?.data?.instructions}
              </Typography>
            </Box>
          }

          <Box className="radio-container">
            <RadioGroup
              value={selectedOption}
              onChange={handleChange}
              className="radio-options"
            >
              {mcqoptions.map((optionObj) => (
                <FormControlLabel
                  key={optionObj.id}
                  value={optionObj.option}
                  control={<Radio />}
                  label={<span className="radio-label">{optionObj.option}</span>}
                  sx={{
                    display: "flex",
                    alignItems: "center", // aligns radio at top-left
                    mb: 1,
                    width: "100%", px: 4,
                    justifyContent: "flex-start",
                  }}
                />
              ))}
            </RadioGroup>
          </Box>


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
        </Box>
      </Box>
    </>
  );
}

export default McqQuestionView;
