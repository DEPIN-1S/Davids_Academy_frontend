import React, { useEffect, useState } from "react";
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
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../features/exam/examSlice";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function TableHighlightQuestionView({ onSubmit }) {
    const dispatch = useDispatch();
    const { questionData, loading, error } = useSelector((state) => state.exam);
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [showReveal, setShowReveal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        if (questionId) dispatch(getQuestionData(questionId));
    }, [dispatch, questionId]);

    const data = questionData?.data || {};
    const {
        id,
        question: questionText,
        tableHeaders = {},
        tableFields = [],
        answer = [],
        explanation = [],
        additionalInfo = [],
        tabsInfo = [],
        instructions,
        marks,
        difficulty,
    } = data;

    useEffect(() => {
        if (tabsInfo?.length) setActiveTab(tabsInfo[0].tabKey);
    }, [tabsInfo]);

    const handleTabChange = (_e, newVal) => setActiveTab(newVal);

    const handleRightColumnClick = (rightColumnValue) => {
        if (showReveal) return;
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            newSet.has(rightColumnValue)
                ? newSet.delete(rightColumnValue)
                : newSet.add(rightColumnValue);
            return newSet;
        });
    };

    const handleReveal = () => {
        const selectedArray = Array.from(selectedItems);
        const correctAnswers = answer || [];
        const allCorrect =
            selectedArray.length === correctAnswers.length &&
            selectedArray.every((item) => correctAnswers.includes(item));

        const userAnswerStr =
            selectedArray.length > 0 ? selectedArray.join(", ") : "No items selected";
        const mark = allCorrect ? Math.abs(marks) || 0 : 0;

        if (typeof onSubmit === "function")
            onSubmit(questionId, allCorrect, mark, userAnswerStr);

        setIsCorrect(allCorrect);
        setShowReveal(true);
    };

    if (loading)
        return <Typography sx={{ textAlign: "center", p: 2 }}>Loading...</Typography>;
    if (error)
        return (
            <Typography sx={{ textAlign: "center", p: 2, color: "red" }}>
                Error: {String(error)}
            </Typography>
        );
    if (!tableFields?.length)
        return (
            <Typography sx={{ textAlign: "center", p: 2 }}>
                No table data available
            </Typography>
        );

    return (
        <Box sx={{ width: "100%" }}>
            {/* Header Info */}
            <Box sx={{ px: { xs: 2, md: 6 }, pt: 2, mb: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#6b7280",
                    }}
                >
                    <Typography>Mark : {marks || ""}</Typography>
                    <Typography>Difficulty : {difficulty || ""}</Typography>
                    <Typography>Type : Table Highlight</Typography>
                </Box>
            </Box>

            {/* Question */}
            <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                    textAlign: "center",
                    color: "#2e3760",
                    pt: 3,
                    fontSize: { xs: "1rem", md: "1.45rem" },
                    mb: 3,
                }}
            >
                {questionText}
            </Typography>



            {/* Tabs */}
            {tabsInfo?.length > 0 && (
                <>
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
                                    "&.Mui-selected": {
                                        backgroundColor: "#2e3760",
                                        color: "#fff",
                                    },
                                },
                            }}
                        >
                            {tabsInfo.map((tab) => (
                                <Tab
                                    key={tab.id || tab.tabKey}
                                    label={tab.tabKey}
                                    value={tab.tabKey}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: "#f8f9ff",
                            borderRadius: "10px",
                            py: 2,
                            px: 3,
                            m: 2,
                            minHeight: "100px",
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
                                    <Typography variant="body1" sx={{ color: "#333", textAlign: 'left'}}>
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
                    <Typography variant="h3" sx={{ fontWeight: 200, fontSize: 15, pt: 2, pb: 4 }}>
                        {questionData?.data?.instructions}
                    </Typography>
                </Box>
            }

            {/* Table */}
            <Box sx={{ px: { xs: 2, md: 6 }, mb: 4, pt: 6 }}>
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
                    <Table sx={{ width: "100%" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>
                                    {tableHeaders.leftHeader || "Category"}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>
                                    {tableHeaders.rightHeader || "Options"}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableFields.map((field, idx) => {
                                const isSelected = selectedItems.has(field.rightColumn);
                                const isCorrectAnswer =
                                    showReveal && answer.includes(field.rightColumn);
                                const isWrongSelection =
                                    showReveal &&
                                    isSelected &&
                                    !answer.includes(field.rightColumn);
                                return (
                                    <TableRow key={field.id || idx}>
                                        <TableCell>{field.leftColumn}</TableCell>
                                        <TableCell
                                            onClick={() =>
                                                handleRightColumnClick(field.rightColumn)
                                            }
                                            sx={{
                                                cursor: showReveal ? "default" : "pointer",
                                                backgroundColor: showReveal
                                                    ? isCorrectAnswer
                                                        ? "#e6f4ea"
                                                        : isWrongSelection
                                                            ? "#ffecec"
                                                            : "white"
                                                    : isSelected
                                                        ? "#e3f2fd"
                                                        : "white",
                                                color: showReveal
                                                    ? isCorrectAnswer
                                                        ? "#1b7a3b"
                                                        : isWrongSelection
                                                            ? "#c0392b"
                                                            : "#475569"
                                                    : isSelected
                                                        ? "#1565c0"
                                                        : "#475569",
                                                fontWeight: isSelected ? 600 : 400,
                                            }}
                                        >
                                            {field.rightColumn}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
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

export default TableHighlightQuestionView;
