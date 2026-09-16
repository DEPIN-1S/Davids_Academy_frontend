import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  CloudUpload,
  Delete,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useFileContext } from "../../context/FileContext"; // ✅ Import the Context
import { useDispatch, useSelector } from "react-redux";
import { deleteTabImage, uploadTabImage, getQuestionData } from "../../features/exam/examSlice";
import ReactQuill from 'react-quill-new'; // <-- CHANGE THIS
import 'react-quill-new/dist/quill.snow.css';

const DropdownQuestionContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // ✅ Use File Context instead of passing files through navigation
  const { questionFile, hasQuestionFile } = useFileContext();
  const dispatch = useDispatch();
  // Get any existing data from previous steps
  const existingData = location.state?.questionData || {};
  const questionType =
    location.state?.questionType || existingData.questionType || "Dropdown";
  const cs_id = location.state?.cs_id || existingData.cs_id || "";
  const exam_type = location.state?.exam_type || existingData.exam_type || "";
  const topic_id = location.state?.topic_id || existingData.topic_id || "";
  const question_type_id = location.state?.question_type_id || existingData.question_type_id || "";
  // Form state
  const [question, setQuestion] = useState(existingData.question || "");
  const [instruction, setInstruction] = useState(
    existingData.instruction || ""
  );
  const [tabs, setTabs] = useState(
    existingData.tabs || [{ tabKey: "", tabValue: "" }]
  );

  const [dropdowns, setDropdowns] = useState(
    existingData.dropdowns || [
      {
        dropdownField: "",
        dropdownanswer: "",
        blank_or_not: true,
        dropDowneOption: [""],
      },
    ]
  );
  const [selectedFile, setSelectedFile] = useState(null); // ✅ Local state for UI, Context for persistence
  const [errors, setErrors] = useState({});

  const { questionData: fetchedQuestionData } = useSelector((state) => state.exam);
  const editQuestionId = location.state?.questionId || existingData.id;

  // ✅ Fetch full question data from backend when editing
  React.useEffect(() => {
    if (editQuestionId) {
      dispatch(getQuestionData(editQuestionId));
    }
  }, [dispatch, editQuestionId]);

  // ✅ Populate full form data (question, instructions, tabs, dropdowns)
  React.useEffect(() => {
    if (editQuestionId && fetchedQuestionData?.data) {
      const q = fetchedQuestionData.data;
      if (q.question) setQuestion(q.question);
      if (q.instructions) setInstruction(q.instructions);
      if (q.tabsInfo && q.tabsInfo.length > 0) {
        setTabs(
          q.tabsInfo.map((t) => ({
            tabKey: t.tabKey || "",
            tabValue: t.tabValue || "",
            tabImage: t.tabImage || "",
          }))
        );
      }
      if (q.dropdowns && q.dropdowns.length > 0) {
        setDropdowns(
          q.dropdowns.map((d) => {
            const rawBlank = d.blank_or_not ?? d.blankOrNot;
            const isBlank = rawBlank === true || rawBlank === 1 || rawBlank === "1" || rawBlank === "true" || String(rawBlank).toLowerCase() === "true";
            const options = Array.isArray(d.dropdownoption)
              ? d.dropdownoption.map((o) => typeof o === "string" ? o : (o.dropdownValue || o.option_value || o.option || o.dropdownoption || ""))
              : [""];
            return {
              id: d.id,
              dropdownField: d.dropdownfield || d.dropdownField || d.dropdowntext || "",
              dropdownanswer: d.dropdownanswer || d.dropdownAnswer || "",
              blank_or_not: isBlank,
              dropDowneOption: options.length > 0 ? options : [""],
            };
          })
        );
      }
    }
  }, [editQuestionId, fetchedQuestionData]);

  // ✅ Initialize with existing file from context if available
  React.useEffect(() => {
    if (questionFile) {
      setSelectedFile(questionFile);
    }
  }, [questionFile]);



  // Add this definition near your other constants/modules
  const tabModules = {
    toolbar: [
      ['bold', 'italic', 'underline'], // Basic formatting
      [{ 'list': 'bullet' }], // Bullet points
      [{ 'color': [] },],

    ],
    clipboard: {
      matchVisual: false, // Important!
    },
  };

  const tabFormats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link',
    'color',
  ];



  // here tab image is added to backend when user selects image from their local machine at that moment api call is triggered

  // File upload handler for tab image
  const handleTabFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [`tabFile_${index}`]: "Only images are allowed",
      }));
      return;
    }

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    const newTabs = [...tabs];
    newTabs[index].previewUrl = previewUrl;
    setTabs(newTabs);

    try {
      // Upload immediately
      const result = await dispatch(uploadTabImage(file)).unwrap();
      console.log("Upload result:", result);

      // ✅ Store uploaded image URL in `tabImage` key
      newTabs[index].tabImage = result?.data?.imageUrl || null;
      setTabs(newTabs);
    } catch (err) {
      console.error("Upload failed:", err);
      setErrors((prev) => ({
        ...prev,
        [`tabFile_${index}`]: "Upload failed. Try again.",
      }));
      newTabs[index].previewUrl = null;
      setTabs(newTabs);
    }
  };

  // Delete handler
  const handleDeleteTabImage = async (index) => {
    const tab = tabs[index];
    console.log("Inside delete img::");

    if (!tab.tabImage) {
      // No uploaded image, just remove preview
      const newTabs = [...tabs];
      newTabs[index].previewUrl = null;
      setTabs(newTabs);
      return;
    }

    try {
      console.log("Inside try :::");

      // Extract only filename
      const fileName = tab.tabImage.split("/").pop();
      console.log("Sending filename to delete API:", fileName);

      // Call delete API
      await dispatch(deleteTabImage(fileName)).unwrap();

      const newTabs = [...tabs];
      newTabs[index].previewUrl = null;
      newTabs[index].tabImage = null; // ✅ Clear tabImage
      setTabs(newTabs);

      console.log("Tab image deleted successfully");
    } catch (error) {
      console.error("Failed to delete tab image:", error);
    }
  };

  // Tab handlers
  const handleTabChange = (index, field, value) => {
    const newTabs = [...tabs];
    newTabs[index][field] = value;
    setTabs(newTabs);
    setErrors((prev) => ({ ...prev, tabs: null }));
  };

  const handleAddTab = () => {
    setTabs([...tabs, { tabKey: "", tabValue: "" }]);
  };

  const handleRemoveTab = (index) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((_, i) => i !== index);
      setTabs(newTabs);
    }
  };

  // ✅ Updated dropdown handlers to match the required data structure
  const handleDropdownFieldChange = (index, value) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[index].dropdownField = value;
    setDropdowns(newDropdowns);
    setErrors((prev) => ({ ...prev, dropdowns: null }));
  };

  const handleDropdownAnswerChange = (index, value) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[index].dropdownanswer = value;
    setDropdowns(newDropdowns);
  };

  const handleDropdownOptionChange = (dropdownIndex, optionIndex, value) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[dropdownIndex].dropDowneOption[optionIndex] = value;
    setDropdowns(newDropdowns);
    setErrors((prev) => ({ ...prev, dropdowns: null }));
  };

  const handleAddDropdownOption = (dropdownIndex) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[dropdownIndex].dropDowneOption.push("");
    setDropdowns(newDropdowns);
  };

  const handleRemoveDropdownOption = (dropdownIndex, optionIndex) => {
    const newDropdowns = [...dropdowns];
    if (newDropdowns[dropdownIndex].dropDowneOption.length > 1) {
      newDropdowns[dropdownIndex].dropDowneOption = newDropdowns[
        dropdownIndex
      ].dropDowneOption.filter((_, i) => i !== optionIndex);
      setDropdowns(newDropdowns);
    }
  };

  const handleAddDropdown = () => {
    setDropdowns([
      ...dropdowns,
      {
        dropdownField: "",
        dropdownanswer: "",
        blank_or_not: true,
        dropDowneOption: [""],
      },
    ]);
  };

  const handleRemoveDropdown = (index) => {
    if (dropdowns.length > 1) {
      const newDropdowns = dropdowns.filter((_, i) => i !== index);
      setDropdowns(newDropdowns);
    }
  };

  const handleToggleBlankOrNot = (index) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[index].blank_or_not = !newDropdowns[index].blank_or_not;
    setDropdowns(newDropdowns);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!question.trim()) {
      newErrors.question = "Question is required";
    }

  
    const validDropdowns = dropdowns.filter(
      (dropdown) =>
        dropdown.dropdownField.trim() &&
        (dropdown.blank_or_not === false ||
          (dropdown.dropdownanswer.trim() &&
            dropdown.dropDowneOption.some((val) => val.trim())))
    );
    if (validDropdowns.length === 0) {
      newErrors.dropdowns =
        "At least one dropdown with field and values is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Navigation handlers - NO files in navigation state
  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    const realQuestionId = location.state?.questionId || location.state?.id || location.state?.questionData?.id || location.state?.questionData?.questionId || fetchedQuestionData?.data?.id || null;
    const isEditMode = location.state?.isEdit || Boolean(realQuestionId);

    // ✅ Prepare ONLY serializable question data matching the required structure
    const questionData = {
      exam_type,
      question_type_id,
      questionType: questionType,
      cs_id,
      topic_id,
      question: question.trim(),
      tabs: tabs.filter((tab) => tab.tabKey.trim() && tab.tabValue.trim()),
      instruction: instruction.trim(),
      dropdowns: dropdowns
        .filter(
          (dropdown) =>
            dropdown.dropdownField.trim() &&
            (dropdown.blank_or_not === false ||
              (dropdown.dropdownanswer.trim() &&
                dropdown.dropDowneOption.some((val) => val.trim())))
        )
        .map((dropdown) => ({
          dropdownField: dropdown.dropdownField,
          dropdownanswer: dropdown.dropdownanswer,
          blank_or_not: dropdown.blank_or_not,
          dropDowneOption: dropdown.dropDowneOption.filter((val) => val.trim()),
        })),
      explanationHeading: fetchedQuestionData?.data?.explanationHeading || (Array.isArray(fetchedQuestionData?.data?.explanation) ? fetchedQuestionData?.data?.explanation[0]?.heading : "") || existingData?.explanationHeading || "",
      explanationText: fetchedQuestionData?.data?.explanationText || (Array.isArray(fetchedQuestionData?.data?.explanation) ? fetchedQuestionData?.data?.explanation[0]?.explanation : "") || existingData?.explanationText || "",
      additionalInfo: fetchedQuestionData?.data?.additionalInfo || (Array.isArray(fetchedQuestionData?.data?.additionalInfo) ? fetchedQuestionData?.data?.additionalInfo[0]?.info : "") || existingData?.additionalInfo || "",
      difficulty: fetchedQuestionData?.data?.difficulty || existingData?.difficulty || "Medium",
      marks: fetchedQuestionData?.data?.marks || existingData?.marks || 1,
      createdAt: existingData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questionId: realQuestionId,
      id: realQuestionId,
      isEdit: isEditMode,
      currentStep: "content",
      completedSteps: ["type", "content"],
    };

    console.log("✅ Navigating with serializable data only:", questionData);
    console.log("✅ File stored in Context:", hasQuestionFile ? "Yes" : "No");

    // ✅ Navigate with ONLY serializable data - NO file objects
    navigate("/admin/answer-explain", {
      state: {
        isEdit: isEditMode,
        questionId: realQuestionId,
        questionData: questionData,
        // ✅ Only pass file metadata for UI display, actual file is in Context
        hasFile: hasQuestionFile,
        fileInfo: selectedFile
          ? {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            // ✅ No 'file' or 'url' properties to avoid serialization issues
          }
          : null,
        fromStep: "content",
      },
    });
  };



  const isFormValid = () => {
    if (location.state?.isEdit && question && question.trim()) return true;
    const hasValidQuestion = question.trim() !== "";
   
    const hasValidDropdowns = dropdowns.some(
      (dropdown) =>
        dropdown.dropdownField.trim() &&
        (dropdown.blank_or_not === false ||
          (dropdown.dropdownanswer.trim() &&
            dropdown.dropDowneOption.some((val) => val.trim())))
    );

    return (
      hasValidQuestion &&
      hasValidDropdowns 
    );
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (selectedFile && selectedFile.url) {
        URL.revokeObjectURL(selectedFile.url);
      }
    };
  }, [selectedFile]);

  return (
    <Box className="question-editor-futuristic" p={3} maxWidth="900px" mx="auto">
      {/* Breadcrumb */}
      <Typography
        variant="caption"
        color="textSecondary"
        mb={2}
        display="block"
      >
        Test type &gt; Question Type &gt; <strong>Question Content</strong>
      </Typography>

      {/* Title + Back Button Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={3}>
        <Box>
          <Typography variant="h5" mb={0.5}>
            {location.state?.isEdit ? "Edit Dropdown Question" : "Enter Dropdown Question Content"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Create or edit a dropdown question with multiple tabs and dropdown selections.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/question-management")}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            color: "#1976d2",
            borderColor: "#1976d2",
            "&:hover": {
              borderColor: "#115293",
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          Back to Question Management
        </Button>
      </Box>

      {/* ✅ Context Status Display */}
      <Card
        sx={{ mb: 3, bgcolor: "primary.light", color: "primary.contrastText" }}
      >
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            🗂️ File Context Status:
          </Typography>
          <Typography variant="body2">
            • Question file in Context:{" "}
            {hasQuestionFile ? "✅ Available" : "➖ None"}
          </Typography>
          <Typography variant="body2">
            • Navigation safety: ✅ No FormData objects in navigation state
          </Typography>
          <Typography variant="body2">
            • File persistence: ✅ Files maintained across component navigation
          </Typography>
        </CardContent>
      </Card>

      {/* Question Input */}
      <Box sx={{ minHeight: '170px', mb: 3 }}>
        <Typography variant="h6" mb={1} color="primary">
          Question Text *
        </Typography>
        <ReactQuill
          theme="snow"
          value={question}
          onChange={(content) => {
            setQuestion(content);
            setErrors(prev => ({ ...prev, question: null }));
          }}
          modules={tabModules}
          formats={tabFormats}
          placeholder="Type your dropdown question here..."
          style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
        />
        {errors.question && (
          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
            {errors.question}
          </Typography>
        )}
      </Box>

      {/* Tabs Section */}
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" color="primary">
            Question Tabs  ({tabs.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {tabs.map((tab, index) => (
            <Card key={index} sx={{ mb: 2, p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1">Tab {index + 1}</Typography>
                {tabs.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveTab(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <TextField
                fullWidth
                label="Tab Key/Title"
                value={tab.tabKey}
                onChange={(e) =>
                  handleTabChange(index, "tabKey", e.target.value)
                }
                placeholder="e.g., Triage Note, Vital Signs"
                sx={{ mb: 2 }}
                size="small"
              />

              {/* <TextField
                fullWidth
                label="Tab Content"
                multiline
                minRows={3}
                value={tab.tabValue}
                onChange={(e) =>
                  handleTabChange(index, "tabValue", e.target.value)
                }
                placeholder="Enter the content that will be displayed in this tab..."
              /> */}

              <Box sx={{ minHeight: '170px', mb: 2 }}> {/* Added marginBottom for spacing */}
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Tab Content</Typography>
                <ReactQuill
                  theme="snow"
                  value={tab.tabValue} // Bind to tab.tabValue
                  onChange={(content) =>
                    // Crucial: React-Quill returns the HTML string directly
                    handleTabChange(index, "tabValue", content)
                  }
                  modules={tabModules} // Use the specific modules for tabs
                  formats={tabFormats}
                  placeholder="Enter the content that will be displayed in this tab..."
                  // Setting a fixed height helps prevent layout shifts
                  style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                mt={5}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`tab-file-input-${index}`}
                  onChange={(e) => handleTabFileUpload(index, e)}
                />
                <Button
                  variant="outlined"
                  component="span"
                  onClick={() =>
                    document.getElementById(`tab-file-input-${index}`).click()
                  }
                  startIcon={<CloudUpload />}
                  size="small"
                >
                  {tab.previewUrl ? "Change Image" : "Add Image"}
                </Button>

                {/*   {tab.previewUrl && (
                                    <Box mt={1}>
                                        <img
                                            src={tab.previewUrl}
                                            alt={`Tab ${index} preview`}
                                            style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover", borderRadius: "4px" }}
                                        />
                                    </Box>
                                )} */}
                {tab.previewUrl && (
                  <Box mt={1} display="flex" alignItems="center" gap={1}>
                    <img
                      src={tab.previewUrl}
                      alt={`Tab ${index} preview`}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <IconButton
                      onClick={() => handleDeleteTabImage(index)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}

                {errors[`tabFile_${index}`] && (
                  <Typography variant="caption" color="error">
                    {errors[`tabFile_${index}`]}
                  </Typography>
                )}
              </Box>
            </Card>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddTab}
            variant="outlined"
            size="small"
          >
            Add Tab
          </Button>

          {errors.tabs && (
            <Typography
              color="error"
              variant="caption"
              sx={{ display: "block", mt: 1 }}
            >
              {errors.tabs}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ minHeight: '170px', mb: 3 }}>
        <Typography variant="h6" mb={1} color="primary">
          Instruction
        </Typography>
        <ReactQuill
          theme="snow"
          value={instruction}
          onChange={(content) => {
            setInstruction(content);
            setErrors((prev) => ({ ...prev, instruction: null }));
          }}
          modules={tabModules}
          formats={tabFormats}
          placeholder="Type your dropdown question instruction here..."
          style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
        />
        {errors.instruction && (
          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
            {errors.instruction}
          </Typography>
        )}
      </Box>

      {/* ✅ Updated Dropdowns Section matching required structure */}
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" color="primary">
            Dropdown Fields * ({dropdowns.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {dropdowns.map((dropdown, dropdownIndex) => (
            <Card key={dropdownIndex} sx={{ mb: 2, p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1">
                  Dropdown {dropdownIndex + 1}
                </Typography>
                {dropdowns.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveDropdown(dropdownIndex)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <TextField
                fullWidth
                label="Dropdown Field Text"
                value={dropdown.dropdownField}
                onChange={(e) =>
                  handleDropdownFieldChange(dropdownIndex, e.target.value)
                }
                placeholder="e.g., Based on the client's, And, this client is at highest risk for"
                sx={{ mb: 2 }}
                size="small"
              />

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Button
                  variant={dropdown.blank_or_not ? "contained" : "outlined"}
                  onClick={() => handleToggleBlankOrNot(dropdownIndex)}
                  size="small"
                >
                  {dropdown.blank_or_not ? "Text Only" : "Dropdown Field"}
                </Button>
                <Typography variant="caption" color="textSecondary">
                  {dropdown.blank_or_not
                    ? "Text field only"
                    : "Has dropdown options"}
                </Typography>
              </Box>

              {dropdown.blank_or_not && (
                <>
                  <Typography variant="subtitle2" mb={1}>
                    Dropdown Options:
                  </Typography>

                  {dropdown.dropDowneOption.map((option, optionIndex) => (
                    <Box
                      key={optionIndex}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={1}
                    >
                      <TextField
                        fullWidth
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleDropdownOptionChange(
                            dropdownIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
                        size="small"
                      />
                      {dropdown.dropDowneOption.length > 1 && (
                        <IconButton
                          onClick={() =>
                            handleRemoveDropdownOption(
                              dropdownIndex,
                              optionIndex
                            )
                          }
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  ))}

                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddDropdownOption(dropdownIndex)}
                    variant="text"
                    size="small"
                  >
                    Add Option
                  </Button>

                  <FormControl fullWidth size="small" sx={{ mt: 3, mb: 2 }}>
                    <Select
                      labelId={`correct-answer-label-${dropdownIndex}`}
                      id={`correct-answer-select-${dropdownIndex}`}
                      value={dropdown.dropdownanswer || ""}
                      onChange={(e) =>
                        handleDropdownAnswerChange(
                          dropdownIndex,
                          e.target.value
                        )
                      }
                      disabled={dropdown.dropDowneOption.length === 0}
                      displayEmpty
                      renderValue={
                        dropdown.dropdownanswer
                          ? undefined
                          : () => "Select correct answer"
                      }
                    >
                      {dropdown.dropDowneOption.length === 0 ? (
                        <MenuItem value="" disabled sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                          Add options first
                        </MenuItem>
                      ) : (
                        dropdown.dropDowneOption.map((option, optionIndex) => (
                          <MenuItem key={optionIndex} value={option} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                            {option || `Option ${optionIndex + 1}`}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </>
              )}
            </Card>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddDropdown}
            variant="outlined"
            size="small"
          >
            Add Dropdown
          </Button>

          {errors.dropdowns && (
            <Typography
              color="error"
              variant="caption"
              sx={{ display: "block", mt: 1 }}
            >
              {errors.dropdowns}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* ✅ Enhanced Form Summary with Context information */}
      <Card sx={{ mt: 3, bgcolor: "grey.50" }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Dropdown Question Summary:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Question: {question ? "✓ Complete" : "✗ Required"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Tabs:{" "}
            {
              tabs.filter((tab) => tab.tabKey.trim() && tab.tabValue.trim())
                .length
            }{" "}
            valid tabs
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Dropdowns:{" "}
            {
              dropdowns.filter(
                (d) =>
                  d.dropdownField.trim() &&
                  (d.blank_or_not === false ||
                    (d.dropdownanswer.trim() &&
                      d.dropDowneOption.some((v) => v.trim())))
              ).length
            }{" "}
            valid dropdowns
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Exhibit:{" "}
            {selectedFile
              ? `✓ ${selectedFile.name} (Context Managed)`
              : "○ Optional"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Navigation: ✅ FormData-safe using React Context
          </Typography>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/question-management")}
        >
          Back to Question Management
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={!isFormValid()}
        >
          Next: Add Explanation
        </Button>
      </Box>
    </Box>
  );
};

export default DropdownQuestionContent;
