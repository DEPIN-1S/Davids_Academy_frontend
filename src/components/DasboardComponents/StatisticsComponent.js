import React from 'react';
import { Box, Card, Typography, Grid, LinearProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const StatisticsComponent = () => {
  const totalQuestions = 1799;
  const usedQuestions = 3;
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
      <Typography variant="h5" fontWeight={700} mb={3}>Statistics</Typography>

      <Grid container spacing={3}>
        {/* Usage Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
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
                <Typography>Unused Questions : <strong>{unusedQuestions}</strong></Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Performance Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            {renderStatBar('Total Correct', 0, 0, '#8feba4')}
            {renderStatBar('Total Incorrect', 0, 0, '#f78181')}
            {renderStatBar('Total Omitted', 0, 0, '#7de6f8')}
            {renderStatBar('Total Correct On Reattempt', 0, 0, '#757bd4')}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsComponent; 
