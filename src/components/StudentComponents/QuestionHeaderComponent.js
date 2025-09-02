import React from 'react';
import '../../styles/DashboardStyles/QuestionHeaderComponent.css';
import { Box, IconButton, Typography } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MenuIcon from '@mui/icons-material/Menu';
import FlagIcon from '@mui/icons-material/Flag';

const QuestionHeaderComponent = ({
  questionNumber = 1,
  totalQuestions = 60,
  qid = '6051',
  user = 'Micheal Carter',
  time = '00:04:59',
  examTitle = ''
}) => {
  return (
    <Box className="question-header-container">
      <div className="header-top">
        <img src="/images/logo.png" alt="logo" className="logo" />
        <div className="question-info">
          {examTitle && (
            <Typography variant="body2" className="exam-title" sx={{ fontWeight: 'bold', mr: 1 }}>
              {examTitle}
            </Typography>
          )}
          <Typography variant="subtitle2" align="left"  >QID: {qid}</Typography>
        </div>
        {/* <Typography variant="body2" className="user">{user}</Typography> */}
      </div>

      <div className="header-progress">
        <Typography variant="body2">{`${questionNumber} OF ${totalQuestions}`}</Typography>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
        <Typography variant="body2" className="time-elapsed">Time Elapsed : {time}</Typography>
      </div>

      {/* <div className="header-actions">
        <IconButton><EditNoteIcon sx={{ color: '#fff' }} /></IconButton>
        <IconButton><MenuIcon sx={{ color: '#fff' }} /></IconButton>
        <IconButton><FlagIcon sx={{ color: '#fff' }} /></IconButton>
      </div> */}
    </Box>
  );
};

export default QuestionHeaderComponent;
