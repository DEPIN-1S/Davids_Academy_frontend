import React, { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionData } from '../features/exam/examSlice'
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function DropDownQuestionView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { questionId } = useParams()
  const { questionData, loading, error } = useSelector((state) => state.exam);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("Question id in params", questionId);
  useEffect(() => {
    if (questionId) {
      console.log("Dispatching thunk with questionId:", questionId);
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  useEffect(() => {
    console.log("Updated dropdownquestionData in state:", questionData);
  }, [questionData]);



  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };
  const tabContent = questionData?.data?.tabsInfo?.reduce((acc, tab) => {
    acc[tab.tabKey] = tab.tabValue;
    return acc;
  }, {}) || {};



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

    >
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        pb: 3,
      }} >
        <Typography >
          Mark :{questionData?.data?.marks}
        </Typography>
        <Typography >
          Difficulty :{questionData?.data?.difficulty}
        </Typography>
        <Typography >
          Question Type : {questionData?.data?.question_type}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textAlign: 'center', color: '#2e3760' }}
      >
        {questionData?.data?.question}
      </Typography>

      {/*  <Tabs
        value={activeTab}
        onChange={handleTabChange}

        sx={{ mb: 2 }}
      >
        {questionData?.data?.tabsInfo.map((tab) => (
          <Tab label={tab.tabKey} key={tab.id} />
        ))}
      </Tabs>

      <Box
        sx={{
          backgroundColor: '#f8f9ff',
          borderRadius: '10px',
          padding: '1rem',
          mb: 2,
          minHeight: '100px',
        }}
      >
        <Typography variant="body1" sx={{ color: '#333' }}>
          {questionData?.data?.tabsInfo?.[activeTab]?.tabValue}
        </Typography>
      </Box> */}

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 2 }}
      >
        {questionData?.data?.tabsInfo?.map((tab) => (
          <Tab label={tab.tabKey} key={tab.id} />
        ))}
      </Tabs>

      <Box
        sx={{
          backgroundColor: '#f8f9ff',
          borderRadius: '10px',
          padding: '1rem',
          mb: 2,
          minHeight: '100px',
        }}
      >
        <Typography variant="body1" sx={{ color: '#333' }}>
          {questionData?.data?.tabsInfo?.[activeTab]?.tabValue || "No content available"}
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
      <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)} // 👈 goes back
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back To Question Management
        </Button>
      </Box>
    </Box>
  );
}

export default DropDownQuestionView;
