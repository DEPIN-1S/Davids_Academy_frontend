import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const DropdownQuestionComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [risk, setRisk] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const explanations = [
    "Nurses' Note explanation: Includes general observations and nurse's documentation.",
    'Laboratory explanation: Blood pressure medication and electrolyte changes are important.',
    'Orders explanation: Review of medical orders including recent prescriptions.',
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const subjectOptions = ['Age', 'Vital Signs', 'Medications'];
  const secondaryOptions = ['Lab Values', 'Cognition', 'Medical History'];
  const riskOptions = ['Fall Risk', 'Dehydration', 'Infection'];

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '1.5rem',
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '950px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Heading */}
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textAlign: 'center', color: '#2e3760' }}
      >
        The following scenario applies to the next 1 items
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        mb={3}
        sx={{ color: '#555' }}
      >
        The nurse in the emergency department (ED) is caring for a 78-year-old female client
      </Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered={!isMobile}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
        sx={{ mb: 2 }}
      >
        <Tab label="Nurses' Note" />
        <Tab label="Laboratory" />
        <Tab label="Orders" />
      </Tabs>

      {/* Explanation */}
      <Box
        sx={{
          backgroundColor: '#f8f9ff',
          borderRadius: '10px',
          padding: '1rem',
          mb: 4,
          minHeight: '100px',
        }}
      >
        <Typography variant="body1" sx={{ color: '#333' }}>
          {explanations[activeTab]}
        </Typography>
      </Box>

      {/* Dropdowns */}
      <Typography
        variant="body1"
        fontWeight={500}
        textAlign="center"
        mb={2}
        sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', color: '#333' }}
      >
        Based on the client&apos;s
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Select</InputLabel>
          <Select value={first} label="Select" onChange={(e) => setFirst(e.target.value)}>
            {subjectOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography>And</Typography>

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Select</InputLabel>
          <Select value={second} label="Select" onChange={(e) => setSecond(e.target.value)}>
            {secondaryOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography
        variant="body1"
        fontWeight={500}
        textAlign="center"
        mb={2}
        sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', color: '#333' }}
      >
        this client is at highest risk for
      </Typography>

      <Box textAlign="center" mb={4}>
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel>Select</InputLabel>
          <Select value={risk} label="Select" onChange={(e) => setRisk(e.target.value)}>
            {riskOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: '#f4c300',
            color: '#000',
            fontWeight: 600,
            padding: '0.6rem 2.5rem',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#e0b000',
            },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {showAnswer && (
        <Box
          mt={4}
          p={2}
          sx={{
            backgroundColor: '#eafbea',
            borderRadius: '10px',
            border: '1px solid #cde8cd',
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            ✅ Correct Answer: Based on the client&apos;s <b>Vital Signs</b> and <b>Cognition</b>, the highest risk is <b>Fall Risk</b>.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DropdownQuestionComponent;
