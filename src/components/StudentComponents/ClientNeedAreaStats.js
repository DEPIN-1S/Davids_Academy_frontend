import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const ClientNeedAreaStats = () => {
  const [subject, setSubject] = useState('Adult Health');
  const [lesson, setLesson] = useState('Cardiovascular');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const totalQuestions = 1799;
  const correct = 0;
  const incorrect = 0;
  const omitted = 0;

  const percentage = (value) => totalQuestions ? ((value / totalQuestions) * 100).toFixed(1) : 0;

  const renderBar = (label, value, color) => (
    <Box mb={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Typography variant="body2">{percentage(value)}% : {value}</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Number(percentage(value))}
        sx={{ height: 8, borderRadius: 5, backgroundColor: '#eee', '& .MuiLinearProgress-bar': { backgroundColor: color } }}
      />
    </Box>
  );

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={3}>Client Need Areas Statistics</Typography>

      <Box
        display="flex"
        flexDirection={isSmallScreen ? 'column' : 'row'}
        gap={2}
        mb={4}
      >
        <FormControl fullWidth size="small">
          <InputLabel>Subject</InputLabel>
          <Select value={subject} label="Subject" onChange={(e) => setSubject(e.target.value)}>
            <MenuItem value="Adult Health">Adult Health</MenuItem>
            <MenuItem value="Pediatrics">Pediatrics</MenuItem>
            <MenuItem value="Mental Health">Mental Health</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Lesson</InputLabel>
          <Select value={lesson} label="Lesson" onChange={(e) => setLesson(e.target.value)}>
            <MenuItem value="Cardiovascular">Cardiovascular</MenuItem>
            <MenuItem value="Respiratory">Respiratory</MenuItem>
            <MenuItem value="Neurology">Neurology</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
        {/* Client Need Area 1 */}
        <Card sx={{ flex: '1 1 300px', p: 3, borderRadius: 3, maxWidth: 500 }}>  
          {renderBar('Total Correct ', correct, '#4CAF50')}
          {renderBar('Total Incorrect ', incorrect, '#F44336')}
          {renderBar('Total Omitted ', omitted, '#03A9F4')}
          {renderBar('Total Correct on Reattempt ', omitted, '#03A9F4')}
        </Card>

        {/* Client Need Area 2 */}
        <Card sx={{ flex: '1 1 300px', p: 3, borderRadius: 3, maxWidth: 500 }}>
           {renderBar('Total Correct ', correct, '#4CAF50')}
          {renderBar('Total Incorrect ', incorrect, '#F44336')}
          {renderBar('Total Omitted ', omitted, '#03A9F4')}
          {renderBar('Total Correct on Reattempt', omitted, '#03A9F4')}
        </Card>
      </Box>
    </Box>
  );
};

export default ClientNeedAreaStats;
