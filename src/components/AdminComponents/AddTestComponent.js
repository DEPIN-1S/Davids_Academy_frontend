import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, TextField, FormControl,
  Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Checkbox, Alert, CircularProgress, useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchCourses } from "../../features/courses/courseSlice";
import { adminFetchMockTestQuestionsByCourseId } from "../../features/exam/examSlice"; // ⬅️ import create test thunk
import { adminCreateTestThunk } from "../../features/exam/examSlice";

function AddTest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");

  // ⬇️ Courses
  const { list: courses = [], loading: coursesLoading } = useSelector(
    (state) => state.course
  );

  // ⬇️ Exam slice
  const {
    adminMockTestQuestionsByCourseId: questions = [],
    adminMockTestQuestionsByCourseIdLoading: questionLoading,
    adminMockTestQuestionsByCourseIdError: questionError,
    loading: submitLoading,
    error: submitError,
  } = useSelector((state) => state.exam);

  // ⬇️ Local states
  const [selected, setSelected] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [testTitle, setTestTitle] = useState(""); // ⬅️ Added for title input

  // Toggle question selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  // ⬇️ Fetch courses initially
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // ⬇️ Fetch topics when course changes
  useEffect(() => {
    if (selectedCourse) {
      const fetchTopics = async () => {
        try {
          const token = sessionStorage.getItem("accessToken");
          const response = await fetch(`${process.env.REACT_APP_API_URL}/topic/list?course_id=${selectedCourse}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const result = await response.json();
          if (result.success) {
            setTopics(result.topics || []);
          }
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      };
      fetchTopics();
    } else {
      setTopics([]);
      setSelectedTopic("");
    }
  }, [selectedCourse]);

  // ⬇️ Fetch questions when course or topic changes
  useEffect(() => {
    if (selectedCourse) {
      dispatch(adminFetchMockTestQuestionsByCourseId({ courseId: selectedCourse, topics: selectedTopic }));
    }
  }, [dispatch, selectedCourse, selectedTopic]);

  // Handlers
  const handleBackClick = () => {
    navigate("/admin/question-management");
  };

  // Handler for saving test
  const handleSaveTest = () => {
    if (!selectedCourse || !startDate || !endDate || selected.length === 0) {
      alert("Please select course, dates, and at least one question.");
      return;
    }

    const payload = {
      fromDate: startDate,
      toDate: endDate,
      testTitle: testTitle,
      questionIds: selected,
      courseId: selectedCourse,
    };

    dispatch(adminCreateTestThunk(payload))
      .unwrap()
      .then((res) => {
        alert("✅ Test created successfully!");
        navigate("/admin/question-management");
        console.log("Created Test:", res);
      })
      .catch((err) => {
        alert("❌ Failed to create test: " + err);
      });
  };



  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Tests &nbsp;&gt;&nbsp; Add Test
      </Typography>

      <Typography variant="h5" fontWeight={600}>
        Add New Test
      </Typography>

      {submitError && <Alert severity="error">{submitError}</Alert>}

      {/* Course & Topic Dropdowns + Title + Dates */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl fullWidth sx={{ flex: 1, minWidth: 200 }}>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2, fontWeight: 500, bgcolor: "#f9f9f9", "& .MuiSelect-select": { padding: 2 } }}
          >
            <MenuItem value="" disabled>
              Select Course
            </MenuItem>
            {coursesLoading && <MenuItem disabled>Loading courses...</MenuItem>}
            {courses.map((c) => (
              <MenuItem key={c.cs_id} value={c.cs_id}>
                {c.cs_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ flex: 1, minWidth: 200 }}>
          <Select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            displayEmpty
            disabled={!selectedCourse}
            sx={{ borderRadius: 2, fontWeight: 500, bgcolor: "#f9f9f9", "& .MuiSelect-select": { padding: 2 } }}
          >
            <MenuItem value="">
              All Topics
            </MenuItem>
            {topics.map((t) => (
              <MenuItem key={t.topic_id} value={t.topic_id}>
                {t.topic_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Test Title"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>

      {/* Questions Table */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Questions
        </Typography>

        {questionLoading && <Typography>Loading questions...</Typography>}
        {questionError && <Alert severity="error">{questionError}</Alert>}

        {!questionLoading && questions.length === 0 && selectedCourse && (
          <Typography>No questions found for this course.</Typography>
        )}

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 500,
            overflowY: "auto",
            borderRadius: 3,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Q ID</strong></TableCell>
                <TableCell><strong>Question</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Difficulty</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
                <TableCell padding="checkbox"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((q) => (
                <TableRow
                  key={q.id}
                  hover
                  selected={selected.includes(q.id)}
                  sx={{
                    cursor: "pointer",
                    "&.Mui-selected": { backgroundColor: "#94aec9ff !important" },
                  }}
                >
                  <TableCell>{q.id}</TableCell>
                  <TableCell>{q.question}</TableCell>
                  <TableCell>{q.questionType}</TableCell>
                  <TableCell>{q.difficulty}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      sx={{ px: 1.5, py: 1, bgcolor: "#2c3e50", color: "white" }}
                      startIcon={<VisibilityIcon />}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(q.id)}
                      onChange={() => toggleSelect(q.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="body2" sx={{ mt: 2 }}>
          ✅ Selected IDs: {selected.join(", ") || "None"}
        </Typography>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row", gap: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackClick} fullWidth={isMobile}>
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleSaveTest}
          sx={{ backgroundColor: "#FFD700", color: "#000" }}
          fullWidth={isMobile}
          disabled={submitLoading}
        >
          {submitLoading ? <CircularProgress size={24} color="inherit" /> : "Save Test"}
        </Button>
      </Box>
    </Box>
  );
}

export default AddTest;
