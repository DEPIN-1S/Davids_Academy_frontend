
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

  // ✅ ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONS OR EARLY RETURNS
  const [activeTab, setActiveTab] = useState(0);
  const [dropdownValues, setDropdownValues] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);

  // Map API response to expected format
  const dropdownTexts = question?.dropdownquestiontext || question?.dropdownTexts || [];
  const tabsInfo = question?.tabsInfo || [];

  // Initialize dropdown values after we know the data exists
  React.useEffect(() => {
    if (!question) return;
    const initialValues = {};
    dropdownTexts.forEach((dt) => {
      if (dt && dt.id) {
        initialValues[dt.id] = '';
      }
    });
    setDropdownValues(initialValues);
  }, [question, dropdownTexts]); // Re-run when question changes

  // Now we can do conditional logic AFTER all hooks are called
  if (!question) {
    return <div>Loading question...</div>;
  }

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

  // Early return for no dropdown data - AFTER all hooks
  if (!dropdownTexts || dropdownTexts.length === 0) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography>No dropdown question data available</Typography>
        <Typography variant="body2" color="text.secondary">
          Debug: {JSON.stringify(question, null, 2)}
        </Typography>
      </Box>
    );
  }

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
        {`The following scenario applies to the next ${dropdownTexts.length} items`}
      </Typography>
      
      {/* Display main question text if available */}
      {question.question && (
        <Typography
          variant="subtitle1"
          textAlign="center"
          mb={3}
          sx={{ color: '#555' }}
        >
          {question.question}
        </Typography>
      )}

      {/* Tabs - only render if tabsInfo exists and has items */}
      {tabsInfo && tabsInfo.length > 0 && (
        <>
          <Tabs
            value={Math.min(activeTab, tabsInfo.length - 1)} // Prevent index out of bounds
            onChange={handleTabChange}
            centered={!isMobile}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{ mb: 2 }}
          >
            {tabsInfo.map((tab, i) => (
              <Tab label={tab?.tabKey || `Tab ${i + 1}`} key={tab?.id || i} />
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
              {tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue || 'No content available'}
            </Typography>
          </Box>
        </>
      )}

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
        {dropdownTexts.map((dt, index) => {
          // Safe access to dropdown data
          if (!dt) return null;
          
          const dropdownId = dt.id || index;
          const dropdownOptions = dt.dragdropoption || dt.dropdownoption || [];
          const dropdownLabel = dt.headings || dt.dropdownField || `Option ${index + 1}`;
          
          return (
            <FormControl sx={{ minWidth: 160 }} size="small" key={dropdownId}>
              <InputLabel>{dropdownLabel}</InputLabel>
              <Select
                value={dropdownValues[dropdownId] || ''}
                label={dropdownLabel}
                onChange={handleDropdownChange(dropdownId)}
                disabled={dt.blankOrNot === '0'}
              >
                {dropdownOptions.map((opt, optIndex) => {
                  if (!opt) return null;
                  
                  const optionId = opt.id || optIndex;
                  const optionValue = opt.dropdownValue || opt.options_value || opt.text || `Option ${optIndex + 1}`;
                  
                  return (
                    <MenuItem key={optionId} value={optionValue}>
                      {optionValue}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          );
        })}
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
            {/* Safe access to dropdown values */}
            ✅ Correct Answer: Based on the client&apos;s{' '}
            {dropdownTexts[0] && (
              <>
                <b>{dropdownValues[dropdownTexts[0].id] || 'Not selected'}</b>
                {dropdownTexts[1] && (
                  <>
                    {' and '}
                    <b>{dropdownValues[dropdownTexts[1].id] || 'Not selected'}</b>
                  </>
                )}
                {dropdownTexts[2] && (
                  <>
                    {', the highest risk is '}
                    <b>{dropdownValues[dropdownTexts[2].id] || 'Not selected'}</b>
                  </>
                )}
              </>
            )}
            {!dropdownTexts[0] && 'Please select options to see the answer.'}
          </Typography>
          
          {/* Show correct answers if available */}
          {question.explanation && question.explanation.length > 0 && (
            <Box mt={2} p={2} sx={{ backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                <strong>Explanation:</strong> {question.explanation[0]?.explanation}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DropdownQuestionComponent;
