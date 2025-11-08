import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AdminStyles/ViewProgress.css";
import { Box, Button, Typography, Tabs, Tab } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchStudentProgress } from "../features/students/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetMockTest, resetQbank } from "../features/exam/examSlice";
import { ToastContainer, toast } from 'react-toastify';

function ViewProgress() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tests, error } = useSelector((state) => state.students);
    const [selectedTab, setSelectedTab] = useState("mockTest");

    useEffect(() => {
        if (studentId) dispatch(fetchStudentProgress(studentId));
    }, [dispatch, studentId]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const mockTests = tests?.mockTest || [];
    const qBank = tests?.qBank || null;

    const handleQbankReset = async (studentId) => {
        console.log("student id::", studentId);
        const resultAction = await dispatch(resetQbank(studentId));
        if (resetQbank.fulfilled.match(resultAction)) {
            toast.success(resultAction.payload?.message || "Q-Bank reset successful!");
        } else {
            toast.error(resultAction.payload || "Failed to reset Q-Bank");
        }
    };

    const handleMockTestReset = async (studentId, testId) => {
        const resultAction = await dispatch(resetMockTest({ student_id: studentId, test_id: testId }));
        if (resetMockTest.fulfilled.match(resultAction)) {
            toast.success(resultAction.payload?.message || "Mock Test reset successful!");
            dispatch(fetchStudentProgress(studentId)); // optional refresh
        } else {
            toast.error(resultAction.payload || "Failed to reset Mock Test");
        }
    };


    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Mock Test" value="mockTest" />
                    <Tab label="Question Bank" value="qBank" />
                </Tabs>
            </Box>

            {selectedTab === "mockTest" && (
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Total Questions</th>
                                <th>Attended</th>
                                <th>Correct</th>
                                <th>Wrong</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTests.length > 0 ? (
                                mockTests.map((test) => (
                                    <tr key={test.test_id}>
                                        <td>{test.testTitle}</td>
                                        <td>{new Date(test.fromDate).toLocaleDateString()}</td>
                                        <td>{new Date(test.toDate).toLocaleDateString()}</td>
                                        <td>{test.totalQuestions}</td>
                                        <td>{test.total_attempted}</td>
                                        <td>{test.correct_count}</td>
                                        <td>{test.wrong_count}</td>
                                        <td><button onClick={() => handleMockTestReset(studentId, test.test_id)} className="action-btn" >Reset Mock Test</button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center" }}>
                                        No mock test progress available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedTab === "qBank" && qBank && (
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Total Questions</th>
                                <th>Attended</th>
                                <th>Correct</th>
                                <th>Wrong</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{qBank.totalQuestions}</td>
                                <td>{qBank.total_attempted}</td>
                                <td>{qBank.correct_count}</td>
                                <td>{qBank.wrong_count}</td>
                                <td>
                                    {qBank.total_attempted > 0 ? (
                                        <button
                                            onClick={() => handleQbankReset(studentId)}
                                            className="action-btn"
                                        >
                                            Reset Q-Bank
                                        </button>
                                    ) : (
                                        <span className="text-gray-500 italic">No attempts yet</span>
                                    )}
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {error && (
                <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Back To Student Management
                </Button>
            </Box>
        </>
    );
}

export default ViewProgress;
