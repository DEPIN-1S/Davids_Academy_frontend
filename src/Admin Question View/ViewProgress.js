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
    const qBank = tests?.qBank || [];

    const handleQbankReset = async (studentId, topicId = null) => {
        console.log("student id::", studentId, " topic id::", topicId);
        const resultAction = await dispatch(resetQbank({ student_id: studentId, topic_id: topicId }));
        if (resetQbank.fulfilled.match(resultAction)) {
            toast.success(resultAction.payload?.message || "Q-Bank reset successful!");
             if (studentId) dispatch(fetchStudentProgress(studentId));
        } else {
            toast.error(resultAction.payload || "Failed to reset Q-Bank");
        }
    };

    const handleMockTestReset = async (studentId, testId) => {
        const resultAction = await dispatch(resetMockTest({ student_id: studentId, test_id: testId }));
        if (resetMockTest.fulfilled.match(resultAction)) {
            toast.success(resultAction.payload?.message || "Mock Test reset successful!");
             if (studentId) dispatch(fetchStudentProgress(studentId));
        } else {
            toast.error(resultAction.payload || "Failed to reset Mock Test");
        }
    };


    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Analysis" value="analysis" />
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
                                    <td colSpan={8} style={{ textAlign: "center" }}>
                                        No mock test progress available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedTab === "qBank" && (
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Topic</th>
                                <th>Total Questions</th>
                                <th>Attended</th>
                                <th>Correct</th>
                                <th>Wrong</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qBank.length > 0 ? (
                                qBank.map((topic, index) => (
                                    <tr key={index}>
                                        <td>{topic.topic_name}</td>
                                        <td>{topic.totalQuestions}</td>
                                        <td>{topic.total_attempted}</td>
                                        <td>{topic.correct_count}</td>
                                        <td>{topic.wrong_count}</td>
                                        <td>
                                            {topic.total_attempted > 0 ? (
                                                <button
                                                    onClick={() => handleQbankReset(studentId, topic.topic_id)}
                                                    className="action-btn"
                                                >
                                                    Reset Topic
                                                </button>
                                            ) : (
                                                <span className="text-gray-500 italic">No attempts yet</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center" }}>
                                        No Q-Bank progress available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedTab === "analysis" && (
                <Box sx={{ mt: 3, px: { xs: 2, md: 5 } }}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, color: "#2e3760", textAlign: "center" }}>
                        Student Progress Analysis
                    </Typography>

                    {(() => {
                        const getPerformanceBadge = (acc) => {
                            const val = Number(acc);
                            if (val >= 85) return { text: "Excellent", color: "#4caf50", bg: "#e8f5e9" };
                            if (val >= 60) return { text: "Good", color: "#f3c600", bg: "#fffdf0" };
                            return { text: "Needs Improvement", color: "#f44336", bg: "#ffebee" };
                        };

                        const renderCard = (title, attended, correct) => {
                            const accuracy = attended > 0 ? ((correct / attended) * 100).toFixed(1) : 0;
                            const perf = getPerformanceBadge(accuracy);
                            return (
                                <Box sx={{ 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    p: 3, bgcolor: '#fff', borderRadius: 4, 
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' 
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2e3760', mb: 2, textAlign: 'center', minHeight: '48px' }}>
                                        {title}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mb: 3, alignItems: 'center' }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e3760' }}>{attended}</Typography>
                                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Attempted</Typography>
                                        </Box>
                                        
                                        <Box sx={{ 
                                            width: 100, height: 100, 
                                            borderRadius: '50%', 
                                            display: 'flex', flexDirection: 'column', 
                                            justifyContent: 'center', alignItems: 'center',
                                            border: `6px solid ${perf.color}`,
                                            boxShadow: `0 0 15px ${perf.bg}`
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: perf.color }}>
                                                {accuracy}%
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#4caf50' }}>{correct}</Typography>
                                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Correct</Typography>
                                        </Box>
                                    </Box>

                                    <Typography sx={{ 
                                        px: 2, py: 0.5, borderRadius: 8, fontWeight: 700, 
                                        color: perf.color, bgcolor: perf.bg, fontSize: '0.85rem'
                                    }}>
                                        {perf.text}
                                    </Typography>
                                </Box>
                            );
                        };

                        return (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                
                                {/* Mock Test Section */}
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e3760', mb: 2, borderBottom: '2px solid #eee', pb: 1 }}>
                                        Mock Test Performance
                                    </Typography>
                                    {mockTests.length > 0 ? (
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                                            {mockTests.map((test, idx) => 
                                                <React.Fragment key={`mock-${idx}`}>
                                                    {renderCard(test.testTitle || `Mock Test ${idx+1}`, test.total_attempted || 0, test.correct_count || 0)}
                                                </React.Fragment>
                                            )}
                                        </Box>
                                    ) : (
                                        <Typography sx={{ color: '#777', fontStyle: 'italic' }}>No Mock Tests attended yet.</Typography>
                                    )}
                                </Box>

                                {/* QBank Section */}
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e3760', mb: 2, borderBottom: '2px solid #eee', pb: 1 }}>
                                        Question Bank Topic Performance
                                    </Typography>
                                    {qBank.length > 0 ? (
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                                            {qBank.map((topic, idx) => 
                                                <React.Fragment key={`topic-${idx}`}>
                                                    {renderCard(topic.topic_name || `Topic ${idx+1}`, topic.total_attempted || 0, topic.correct_count || 0)}
                                                </React.Fragment>
                                            )}
                                        </Box>
                                    ) : (
                                        <Typography sx={{ color: '#777', fontStyle: 'italic' }}>No Question Bank topics attended yet.</Typography>
                                    )}
                                </Box>

                            </Box>
                        );
                    })()}
                </Box>
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
