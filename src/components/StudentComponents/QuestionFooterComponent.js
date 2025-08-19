import React from 'react';
import '../../styles/DashboardStyles/QuestionFooterComponent.css';
import { Box, Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const QuestionFooterComponent = ({
  onEnd,
  onPause,
  onNext,
  onPrevious,
  disablePrevious = false,
  disableNext = false,
  questionNumber,
  totalQuestions
}) => {
  return (
    <Box className="question-footer">
      <div className="left-buttons">
        <Button
          startIcon={<LogoutIcon />}
          onClick={onEnd}
          className="footer-button"
          color="error"
        >
          End
        </Button>
        <Button
          startIcon={<PauseIcon />}
          onClick={onPause}
          className="footer-button"
        >
          Pause
        </Button>
      </div>

      <div className="center-info" style={{ alignSelf: 'center' }}>
        {questionNumber && totalQuestions && (
          <Typography variant="body2" color="textSecondary">
            Question {questionNumber} of {totalQuestions}
          </Typography>
        )}
      </div>

      <div className="right-buttons">
        <Button
          startIcon={<ArrowBackIosNewIcon />}
          onClick={onPrevious}
          className="footer-button"
          disabled={disablePrevious}
        >
          Previous
        </Button>
        <Button
          endIcon={<ArrowForwardIosIcon />}
          onClick={onNext}
          className="footer-button"
          disabled={disableNext}
        >
          Next
        </Button>
      </div>
    </Box>
  );
};

export default QuestionFooterComponent;
