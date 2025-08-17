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

const DropdownQuestionComponent = ({ question }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [dropdownValues, setDropdownValues] = useState(() => {
    // Initialize selected values as empty string for each dropdownField
    const initialValues = {};
    question.dropdownTexts.forEach((dt) => {
      initialValues[dt.id] = '';
    });
    return initialValues;
  });
  const [showAnswer, setShowAnswer] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDropdownChange = (id) => (event) => {
    setDropdownValues((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

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
        {`The following scenario applies to the next ${question.dropdownTexts.length} items`}
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        mb={3}
        sx={{ color: '#555' }}
      >
        {/* Optionally add a scenario or context here */}
        {/* You can pass it via prop or add question.scenario if available */}
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
        {question.tabsInfo.map((tab, i) => (
          <Tab label={tab.tabKey} key={tab.id} />
        ))}
      </Tabs>

      {/* Explanation for active tab */}
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
          {question.tabsInfo[activeTab]?.tabValue || ''}
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
          flexWrap: 'wrap',
        }}
      >
        {question.dropdownTexts.map((dt) => (
          <FormControl sx={{ minWidth: 160 }} size="small" key={dt.id}>
            <InputLabel>{dt.dropdownField}</InputLabel>
            <Select
              value={dropdownValues[dt.id] || ''}
              label={dt.dropdownField}
              onChange={handleDropdownChange(dt.id)}
              disabled={dt.blankOrNot === '0'}
            >
              {dt.dropdownoption.map((opt) => (
                <MenuItem key={opt.id} value={opt.dropdownValue}>
                  {opt.dropdownValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>

      <Typography
        variant="body1"
        fontWeight={500}
        textAlign="center"
        mb={2}
        sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', color: '#333' }}
      >
        {/* Possibly a closing phrase, configurable or static */}
        this client is at highest risk for
      </Typography>

      {/* If needed, you can add another dropdown for risk or use last dropdown in dropdownTexts */}

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
            {/* You can customize this message or build dynamically */}
            ✅ Correct Answer: Based on the client&apos;s{' '}
            <b>{dropdownValues[question.dropdownTexts[0].id]}</b> and{' '}
            <b>{dropdownValues[question.dropdownTexts[1].id]}</b>, the highest risk is{' '}
            <b>{dropdownValues[question.dropdownTexts[2].id]}</b>.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DropdownQuestionComponent;
