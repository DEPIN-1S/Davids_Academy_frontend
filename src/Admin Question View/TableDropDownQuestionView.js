// TableDropDownQuestionView.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionData } from "../features/exam/examSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactQuill from 'react-quill-new'; // <-- CHANGE THIS
import 'react-quill-new/dist/quill.snow.css';


function TableDropDownQuestionView({ onSubmit }) {
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [dropdownValues, setDropdownValues] = useState({});
  const [activeTab, setActiveTab] = useState("");

  // Fetch question data
  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  console.log("ew", questionData);


  // initialize dropdownValues when tableDropdownFields arrive
  useEffect(() => {
    const fields = questionData?.data?.tableDropdownFields || [];
    if (!fields.length) {
      setDropdownValues({});
      return;
    }
    const initial = {};
    fields.forEach((f, idx) => {
      const key = f.id ?? idx;
      initial[key] = f.selected ?? f.answer ?? "";
    });
    setDropdownValues(initial);
  }, [questionData?.data?.tableDropdownFields]);

  // set default active tab when tabsInfo loads
  useEffect(() => {
    const firstTabKey = questionData?.data?.tabsInfo?.[0]?.tabKey;
    if (firstTabKey && !activeTab) {
      setActiveTab(firstTabKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionData?.data?.tabsInfo]); // only run when tabsInfo changes

  // safe extracts
  const questionText = questionData?.data?.question || "";
  const tableHeaders =
    questionData?.data?.tableHeaders ||
    (Array.isArray(questionData?.data?.headers)
      ? {
        leftHeader:
          questionData.data.headers[0] ?? "Category",
        rightHeader:
          questionData.data.headers[1] ?? "Anticipated Order",
      }
      : questionData?.data?.headers) ||
    { leftHeader: "Category", rightHeader: "Anticipated Order" };
  const tableDropdownFields = questionData?.data?.tableDropdownFields || [];
  const marks = questionData?.data?.marks || "";
  const difficulty = questionData?.data?.difficulty || "";
  const tabsInfo = questionData?.data?.tabsInfo || [];

  // handlers
  const handleDropdownChange = (key) => (event) => {
    const value = event.target.value;
    setDropdownValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleTabChange = (_event, newTab) => {
    setActiveTab(newTab);
  };

  const handleSubmit = () => {
    if (typeof onSubmit === "function") {
      onSubmit(questionId, dropdownValues);
      return;
    }
    console.log("Submit answers for", questionId, dropdownValues);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>Loading question...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography color="error">Error: {String(error)}</Typography>
      </Box>
    );
  }

  if (!questionData || !tableDropdownFields.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No table dropdown question data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, md: 6 },
          pt: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
          <Typography>Mark: {marks || ""}</Typography>
          <Typography>Difficulty: {difficulty || ""}</Typography>
          <Typography>Question Type: Table Dropdown</Typography>
        </Box>
      </Box>

      {/* Question text */}
      <Typography

        fontWeight={700}
        sx={{
          textAlign: "center",
          color: "#2e3760",
          pt: 2,
          mb: 2,
          fontSize: { xs: "1rem", md: "1.45rem" },
        }}
       dangerouslySetInnerHTML={{ __html: questionText || "" }} />


      {/* Tabs */}
      {tabsInfo?.length > 0 && (
        <>
          {/* Tab Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2, px: 1 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                "& .MuiTab-root": {
                  borderRadius: "999px",
                  textTransform: "none",
                  backgroundColor: "#fff",
                  border: "1px solid #e6eaef",
                  marginRight: "8px",
                  "&.Mui-selected": {
                    backgroundColor: "#2e3760",
                    color: "#fff",
                  },
                },
              }}
            >
              {tabsInfo.map((tab) => (
                <Tab
                  key={tab.id ?? tab.tabKey}
                  label={tab.tabKey}
                  value={tab.tabKey}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              backgroundColor: "#f8f9ff",
              borderRadius: "10px",
              py: 3,
              px: 3,
              m: 2,
              minHeight: "120px",
              textAlign: "center", // ✅ center everything
            }}
          >
            {(() => {
              const activeTabData = tabsInfo.find((t) => t.tabKey === activeTab);
              if (!activeTabData) return null;

              return (
                <>
                  {activeTabData?.tabImage && (
                    <img
                      src={`${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${activeTabData.tabImage}`}
                      alt="tabImage"
                      style={{
                        display: "block", // ✅ center image
                        margin: "0 auto 16px",
                        width: 600,
                        maxWidth: "100%", // responsive
                        borderRadius: 8,
                      }}
                    />
                  )}
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: 'left',
                      color: "#333",
                      // Prevent default <p> margins from Quill
                      '& p': { margin: 0, marginBottom: '0.5em' },
                      '& p:last-child': { marginBottom: 0 },
                      '& *': { lineHeight: 1.6 },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: activeTabData?.tabValue || ''
                    }}
                  />
                </>
              );
            })()}
          </Box>
        </>
      )}


      {questionData?.data?.instructions &&
        <Box sx={{ py: 4, alignItems: "center", justifyContent: "center", textAlign: "center" }} >
          <Typography sx={{ fontWeight: 200 }} ><h4>Question Instruction</h4></Typography>
          <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 15, pt: 2, pb: 4 }} dangerouslySetInnerHTML={{ __html: questionData?.data?.instructions || "" }} />
        </Box>
      }


      {/* Table */}
      <Box sx={{ px: { xs: 2, md: 6 }, mb: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            maxWidth: { xs: "100%", md: 720 },
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Table sx={{ width: "100%", tableLayout: "fixed" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                  width="60%"
                  dangerouslySetInnerHTML={{ __html: tableHeaders.leftHeader || "Category" }}
                />
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                  width="40%"
                  dangerouslySetInnerHTML={{ __html: tableHeaders.rightHeader || "Anticipated Order" }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {tableDropdownFields.map((field, index) => {
                const key = field.id ?? index;
                return (
                  <TableRow key={key} sx={{ backgroundColor: "white" }}>
                    <TableCell
                      sx={{
                        color: "#1f2937",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                      dangerouslySetInnerHTML={{ __html: field.fieldLabel || "" }}
                    />
                    <TableCell sx={{ borderBottom: "1px solid #e2e8f0" }}>
                      <Select
                        value={dropdownValues[key] ?? ""}
                        onChange={handleDropdownChange(key)}
                        displayEmpty
                        fullWidth
                        sx={{
                          fontSize: "0.95rem",
                          height: 40,
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {(field.dropdownOptions || []).map((option, optIndex) => (
                          <MenuItem key={option ?? optIndex} value={option} dangerouslySetInnerHTML={{ __html: option || "" }} />
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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

export default TableDropDownQuestionView;
