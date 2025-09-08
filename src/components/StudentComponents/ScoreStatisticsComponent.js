
import React from 'react';
import { Box, Typography, LinearProgress, Stack, Chip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const ScoreStatisticsComponent = ({ peerScore = 62, yourScore = 19, testMode = 'Tutorial', questionMode = 'Unused', completedOn = '07 Jul, 2025 4:26 pm', testId = '21306234' }) => {
  const renderScoreBar = (title) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight="600" mb={1}>
        {title}
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Average Peer Score : {peerScore}%</Typography>
        <Typography variant="body2">Your Score : {yourScore}%</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={yourScore}
        sx={{
          mt: 1,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': { backgroundColor: '#76d275' }
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight="600">Test ID – {testId}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>Download as PDF</Typography>
          <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>Notes</Typography>
        </Stack>
      </Stack>
      <Box
        sx={{
          backgroundColor: '#f2f2f2',
          borderRadius: '16px',
          padding: 3,
        }}
      >
        {renderScoreBar('Classic')}
        {renderScoreBar('NGN')}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight="500">Test Mode:</Typography>
            <Chip label={testMode} size="small" />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight="500">Question Mode:</Typography>
            <Chip label={questionMode} size="small" />
          </Stack>
        </Stack>
        <Box mt={2}>
          <Typography variant="body2" fontWeight="500">
            Completed On :
            <Chip
              label={completedOn}
              size="small"
              sx={{ ml: 1, backgroundColor: '#fff' }}
            />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ScoreStatisticsComponent;
