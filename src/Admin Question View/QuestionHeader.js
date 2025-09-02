import React from 'react'
import { Box, IconButton, Typography } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MenuIcon from '@mui/icons-material/Menu';
import FlagIcon from '@mui/icons-material/Flag';

function QuestionHeader() {
    console.log("✅ QuestionHeader rendered");
    return (
        <Box className="question-header-container" >
            {/* Top section */}
            <div className="header-top">
                <img src="/images/logo.png" alt="logo" className="logo" />
                <div className="question-info">
                    <Typography variant="body2" className="exam-title" sx={{ fontWeight: 'bold', mr: 1 }}>
                        Sample Exam
                    </Typography>
                    <Typography variant="subtitle2">QID: 12345</Typography>
                </div>
                <Typography variant="body2" className="user">John Doe</Typography>
            </div>

            {/* Progress section */}
            <div className="header-progress">
                <Typography variant="body2">3 OF 10</Typography>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `30%` }} />
                </div>
                <Typography variant="body2" className="time-elapsed">
                    Time Elapsed : 02:15
                </Typography>
            </div>

            {/* Action buttons */}
            <div className="header-actions">
                <IconButton><EditNoteIcon sx={{ color: '#fff' }} /></IconButton>
                <IconButton><MenuIcon sx={{ color: '#fff' }} /></IconButton>
                <IconButton><FlagIcon sx={{ color: '#fff' }} /></IconButton>
            </div>
        </Box>
    )
}

export default QuestionHeader
