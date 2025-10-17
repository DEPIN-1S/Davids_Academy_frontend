import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../features/exam/examSlice";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


function MultiDropdownQuestionView({ onSubmit }) {
    const dispatch = useDispatch();
    const { questionData, loading, error } = useSelector((state) => state.exam);
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("");
    const [dropdownValues, setDropdownValues] = useState({});

    // Fetch question via redux
    useEffect(() => {
        if (questionId) dispatch(getQuestionData(questionId));
    }, [dispatch, questionId]);

    // Initialize dropdown values
    useEffect(() => {
        console.log("qData", questionData?.data);

        const rows = questionData?.data?.rows || [];
        const initial = {};
        rows.forEach((row, rIdx) => {
            row.columns.forEach((col) => {
                const key = `${rIdx}-${col.colIndex}`;
                initial[key] =
                    col.blankOrNot === "1" ? col.selected ?? "" : col.value ?? "";
            });
        });
        setDropdownValues(initial);
    }, [questionData?.data?.rows]);

    // Set default active tab
    useEffect(() => {
        const firstTab = questionData?.data?.tabsInfo?.[0]?.tabKey;
        if (firstTab && !activeTab) setActiveTab(firstTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionData?.data?.tabsInfo]);

    const handleDropdownChange = (rowIdx, colIdx) => (e) => {
        const key = `${rowIdx}-${colIdx}`;
        setDropdownValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleTabChange = (_event, newTab) => {
        setActiveTab(newTab);
    };

    const handleSubmit = () => {
        if (typeof onSubmit === "function") {
            onSubmit(questionId, dropdownValues);
        } else {
            console.log("Table Dropdown Answers:", questionId, dropdownValues);
        }
    };

    const questionText = questionData?.data?.question || "";
    const marks = questionData?.data?.marks || "";
    const difficulty = questionData?.data?.difficulty || "";
    const tabsInfo = questionData?.data?.tabsInfo || [];
    const headers = questionData?.data?.headers || [];
    const rows = questionData?.data?.rows || [];
    const instructions = questionData?.data?.instructions || "";

    if (loading)
        return (
            <Typography sx={{ p: 2, textAlign: "center" }}>
                Loading question...
            </Typography>
        );
    if (error)
        return (
            <Typography sx={{ p: 2, textAlign: "center", color: "red" }}>
                Error: {String(error)}
            </Typography>
        );
    if (!rows.length || !headers.length)
        return (
            <Typography sx={{ p: 2, textAlign: "center" }}>
                No table data available
            </Typography>
        );

    return (
        <Box sx={{ px: 2, py: 2 }}>
            {/* Question info */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography>Mark: {marks}</Typography>
                <Typography>Difficulty: {difficulty}</Typography>
                <Typography>Type: Table Dropdown</Typography>
            </Box>

            {/* Question Text */}
            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ textAlign: "center", mb: 2, pt: 4, fontSize: { xs: "1rem", md: "1.45rem" } }}
            >
                {questionText}
            </Typography>


            {instructions && (
                <Typography
                    sx={{
                        textAlign: "center", color: "#4b5563", mb: 4, pt: 4,
                        fontSize: { xs: "0.9rem", md: "1.25rem" },
                    }}
                >
                    {instructions}
                </Typography>
            )}

            {/* ✅ Modern Tabs Design  */}
            {tabsInfo?.length > 0 && (
                <>
                    {/* Tabs */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2,
                            px: 1,
                        }}
                    >
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
                                    "&.Mui-selected": {
                                        backgroundColor: "#2e3760",
                                        color: "#fff",
                                    },
                                },
                            }}
                        >
                            {tabsInfo.map((tab) => (
                                <Tab key={tab.id ?? tab.tabKey} label={tab.tabKey} value={tab.tabKey} />
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
                            textAlign: "center", // center image + text
                        }}
                    >
                        {(() => {
                            const activeTabData = tabsInfo.find((t) => t.tabKey === activeTab);
                            if (!activeTabData) return null;

                            return (
                                <>
                                    {activeTabData?.tabImage && (
                                        <img
                                            src={`https://lunarsenterprises.com:6040/${activeTabData.tabImage}`}
                                            alt="Exhibit"
                                            style={{
                                                display: "block", // center image
                                                margin: "0 auto 16px",
                                                width: 500,
                                                maxWidth: "100%",
                                                borderRadius: 8,
                                            }}
                                        />
                                    )}
                                    <Typography variant="body1" sx={{textAlign: 'left', color: "#333" }}>
                                        {activeTabData?.tabValue || ""}
                                    </Typography>
                                </>
                            );
                        })()}
                    </Box>
                </>
            )}


            {questionData?.data?.instructions &&
                <Box sx={{ py: 4, alignItems: "center", justifyContent: "center", textAlign: "center" }} >
                    <Typography sx={{ fontWeight: 200 }} ><h4>Question Instruction</h4></Typography>
                    <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 15, pt: 2, }}>
                        {questionData?.data?.instructions}
                    </Typography>
                </Box>
            }


            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{ maxWidth: 900, margin: "0 auto", mb: 3, mt: 2 }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f1f5f9" }}>

                            {headers.map((h, idx) => (
                                <TableCell key={idx} sx={{ fontWeight: 600 }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rIdx) => (
                            <TableRow key={rIdx}>
                                <TableCell sx={{ fontWeight: 500 }}>
                                    {row.rowLabel}
                                </TableCell>
                                {row.columns.map((col) => {
                                    const key = `${rIdx}-${col.colIndex}`;
                                    const value = dropdownValues[key] ?? "";
                                    const options = col.options || [];
                                    return (
                                        <TableCell key={key}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={value}
                                                    onChange={handleDropdownChange(
                                                        rIdx,
                                                        col.colIndex
                                                    )}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {options.map((opt, i) => (
                                                        <MenuItem key={i} value={opt}>
                                                            {opt}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
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

export default MultiDropdownQuestionView;
