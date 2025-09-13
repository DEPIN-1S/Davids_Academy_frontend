import React, { useEffect, useState } from 'react';

import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from '@mui/material';
import { getQuestionData } from "../features/exam/examSlice"
import '../styles/DashboardStyles/RadioButtonQuestionComponent.css';
import RevealAnswerComponent from '../components/StudentComponents/RevealAnswerComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Height } from '@mui/icons-material';
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
  const questionText = questionData.data.question;
  const mark = questionData.data.marks;
  const difficulty = questionData.data.difficulty;
  const question_type = questionData.data.question_type;
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

        pt: 5,
      }}  >


        <Box
          className="radio-container"

        >
          {questionData?.data?.exhibit && (
            <img
              src={questionData.data.exhibit}
              alt="Exhibit"
              style={{ maxWidth: '100%', marginBottom: '1rem', borderRadius: 8 }}
            />
          )}


          <Typography variant="body1" className="question-text" gutterBottom>
            {questionText}
          </Typography>

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
              />
            ))}
          </RadioGroup>
          {/* 
      <Box className="reveal-btn-wrapper">
        <Button
          variant="contained"
          className="reveal-btn"
          onClick={handleReveal}
        >
          Reveal Answer
        </Button>
      </Box>

      {showAnswer && (
        <>
          <Typography className="correct-answer" sx={{ mt: 2 }}>
            ✅ Correct Answer: <strong>{answer}</strong>
          </Typography>

          <Typography className="explanation-text" sx={{ mt: 1 }}>
            <strong>{explanation[0].heading}:</strong>{' '}
            {explanation[0].explanation}
          </Typography>

          <Typography className="additional-info-text" sx={{ mt: 1 }}>
            <strong>Info:</strong> {additionalInfo[0].info}
          </Typography>

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0].heading}
            explanationParagraphs={explanation.map((exp) => exp.explanation)}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info)}
            additionalInfoImage={null}
          />
        </>
      )} */}
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
    </>
  );
}

export default McqQuestionView;
