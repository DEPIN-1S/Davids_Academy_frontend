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

function DropDownQuestionView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ✅ Static Tabs Info
  const tabsInfo = [
    { id: 1, tabKey: 'Tab 1', tabValue: 'This is explanation for Tab 1.' },
    { id: 2, tabKey: 'Tab 2', tabValue: 'This is explanation for Tab 2.' },
    { id: 3, tabKey: 'Tab 3', tabValue: 'This is explanation for Tab 3.' },
  ];

  // ✅ Static dropdowns
  const dropdowns = [
    {
      id: 1,
      dropdownField: 'Age Group',
      blankOrNot: '1',
      dropdownoption: [
        { id: 1, dropdownValue: '18-25' },
        { id: 2, dropdownValue: '26-35' },
        { id: 3, dropdownValue: '36-45' },
      ],
    },
    {
      id: 2,
      dropdownField: 'Medical Condition',
      blankOrNot: '1',
      dropdownoption: [
        { id: 1, dropdownValue: 'Diabetes' },
        { id: 2, dropdownValue: 'Hypertension' },
        { id: 3, dropdownValue: 'None' },
      ],
    },
    {
      id: 3,
      dropdownField: 'Highest Risk Factor',
      blankOrNot: '1',
      dropdownoption: [
        { id: 1, dropdownValue: 'Heart Disease' },
        { id: 2, dropdownValue: 'Stroke' },
        { id: 3, dropdownValue: 'Obesity' },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [dropdownValues, setDropdownValues] = useState({
    1: '',
    2: '',
    3: '',
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
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textAlign: 'center', color: '#2e3760' }}
      >
        The following scenario applies to the next 3 items
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered={!isMobile}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
        sx={{ mb: 2 }}
      >
        {tabsInfo.map((tab) => (
          <Tab label={tab.tabKey} key={tab.id} />
        ))}
      </Tabs>

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
          {tabsInfo[activeTab]?.tabValue}
        </Typography>
      </Box>

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
        {dropdowns.map((dt) => (
          <FormControl sx={{ minWidth: 160 }} size="small" key={dt.id}>
            <InputLabel>{dt.dropdownField}</InputLabel>
            <Select
              value={dropdownValues[dt.id]}
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
        this client is at highest risk for
      </Typography>

     {/*  <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: '#f4c300',
            color: '#000',
            fontWeight: 600,
            padding: '0.6rem 2.5rem',
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#e0b000' },
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
            ✅ Correct Answer: Based on the client&apos;s{' '}
            <b>{dropdownValues[1]}</b> and <b>{dropdownValues[2]}</b>, the highest
            risk is <b>{dropdownValues[3]}</b>.
          </Typography>
        </Box>
      )} */}
    </Box>
  );
}

export default DropDownQuestionView;
