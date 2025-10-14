import React, { useEffect, useState } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button, } from '@mui/material';
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
  const exhibit = 'https://via.placeholder.com/600x250.png?text=Exhibit+Image';
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
                width={500}
                src={`${process.env.BASE_URL}/${questionData.data.exhibit}`}
                alt="Exhibit"
                style={{ maxWidth: '100%', marginBottom: '1rem', borderRadius: 8 }}
              />
            )}
          </Box>

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
