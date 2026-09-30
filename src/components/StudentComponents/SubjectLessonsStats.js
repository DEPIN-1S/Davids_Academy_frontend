import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const StatisticsComponent = () => {
  const [subject, setSubject] = useState('Adult Health');
  const [lesson, setLesson] = useState('Cardiovascular');

  const totalQuestions = 1799;
  const usedQuestions = 101;
  const unusedQuestions = totalQuestions - usedQuestions;

  const doughnutData = {
    labels: ['Used', 'Unused'],
    datasets: [
      {
        data: [usedQuestions, unusedQuestions],
        backgroundColor: ['#f4c430', '#eaeaea'],
        borderWidth: 0,
      },
    ],
  };

  const renderStatBar = (label, value, percent, color) => (
    <Box mb={2}>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Typography variant="body2" color="textSecondary">
          {percent}% : {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: '#eee',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={3}>Subjects and Lessons Statistics</Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Subject</InputLabel>
            <Select value={subject} label="Subject" onChange={(e) => setSubject(e.target.value)}>
              <MenuItem value="Adult Health">Adult Health</MenuItem>
              <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              <MenuItem value="Mental Health">Mental Health</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Lesson</InputLabel>
            <Select value={lesson} label="Lesson" onChange={(e) => setLesson(e.target.value)}>
              <MenuItem value="Cardiovascular">Cardiovascular</MenuItem>
              <MenuItem value="Respiratory">Respiratory</MenuItem>
              <MenuItem value="Neurology">Neurology</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Subject Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>{subject}</Typography>
            <Box display="flex" alignItems="center" gap={3} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Box width={150}>
                <Doughnut data={doughnutData} />
                <Typography align="center" variant="subtitle1" fontWeight="bold" mt={1}>
                  Usage
                </Typography>
              </Box>
              <Box>
                <Typography>Total Questions : <strong>{totalQuestions}</strong></Typography>
                <Typography>Used Questions : <strong>{usedQuestions}</strong></Typography>
                <Typography>Correct Questions : <strong>0</strong></Typography>
                <Typography>Incorrect Questions : <strong>0</strong></Typography>
                <Typography>Omitted Questions : <strong>0</strong></Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Lesson Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>{lesson}</Typography>
            <Box display="flex" alignItems="center" gap={3} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Box width={150}>
                <Doughnut data={doughnutData} />
                <Typography align="center" variant="subtitle1" fontWeight="bold" mt={1}>
                  Usage
                </Typography>
              </Box>
              <Box>
                <Typography>Total Questions : <strong>{totalQuestions}</strong></Typography>
                <Typography>Used Questions : <strong>{usedQuestions}</strong></Typography>
                <Typography>Correct Questions : <strong>0</strong></Typography>
                <Typography>Incorrect Questions : <strong>0</strong></Typography>
                <Typography>Omitted Questions : <strong>0</strong></Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsComponent;
