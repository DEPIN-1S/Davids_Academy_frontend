import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { adminFetchQBankQuestions, adminFetchMockTestQuestions, adminFetchTestQuestions, getTestQuestions, adminDeleteQBankQuestion, adminDeleteTest } from "../../features/exam/examSlice";
import "../../styles/AdminStyles/QManagement.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";
import McqQuestionView from "../../Admin Question View/McqQuestionView";
import { Modal, Box } from "@mui/material";


const QManagementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Redux state
    const {
        adminQBankQuestions,
        adminQBankTotalPages,
        adminQBankTotalCount
    } = useSelector((state) => state.exam);

    const {
        adminMockTestQuestions,
        adminMockTestTotalPages,
        adminMockTestTotalCount
    } = useSelector((state) => state.exam);

    const {
        adminTestQuestions,
        adminTestQuestionsTotalPages,
        adminTestQuestionsTotalCount
    } = useSelector((state) => state.exam);

    const [qBankPage, setQBankPage] = useState(1);
    const [mockPage, setMockPage] = useState(1);
    const [testPage, setTestPage] = useState(1);
    const limit = 10;


    const handleViewQuestion = (questionData) => {
        console.log("Question Data in question view", questionData);
        const { questionType } = questionData;
        const  questionId  = questionData.id;
        console.log("question Id :::",questionId);
        

        switch (questionType) {
            case 'MCQ':
                navigate(`/admin/MCQ-question-view/${questionId}`);
                break;
            case 'Dropdown':
                navigate(`/admin/DropDown-question-view/${questionId}`);
                break;
            case 'Drag Drop':
                navigate(`/admin/DragDrop-question-view/${questionId}`);
                break;
            case 'Multiple Radio':
                navigate(`/admin/MultiRadio-question-view/${questionId}`);
                break;
            case 'Fill in the Blanks':
                navigate('/admin/FillinTheBlanksQuestion-question-view');
                break;
            case 'Sentence Highlight':
                navigate(`/admin/SentenceHighlight-question-view/${questionId}`);
                break;
            case 'Sorting':
                navigate(`/admin/Sorting-question-view/${questionId}`);
                break;
            default:
                console.warn('Unknown question type:', questionType);
                break;
        }
    };


    // ✅ Fetch when page changes
    useEffect(() => {
        console.log("Fetching Q-bank page:", qBankPage);
        console.log(" ✅ Fetching Q bank questions :::", adminQBankQuestions);

        dispatch(adminFetchQBankQuestions({ page: qBankPage, limit }));
    }, [dispatch, qBankPage]);

    useEffect(() => {
        dispatch(adminFetchMockTestQuestions({ page: mockPage, limit }));
    }, [dispatch, mockPage]);

    useEffect(() => {
        console.log("✅ Fetching Test questions :::", testPage);

        dispatch(adminFetchTestQuestions({ page: testPage, limit }));
        console.log("Fetching test questions limit ::: ", limit, testPage);

    }, [dispatch, testPage]);

    useEffect(() => {
        dispatch(getTestQuestions());
    }, [dispatch]);

    // Tabs & Search
    const [activeTab, setActiveTab] = useState("Q-bank");
    const [searchTerm, setSearchTerm] = useState("");


    // Handlers
    const handleAddQuestionClick = () => navigate("/admin/selectCourse");
    const handleAddTestClick = () => navigate("/admin/add-test");
    const handleEdit = (id) => console.log("Edit:", id);

    const handleDelete = (id) => {
        console.log("Deleting:", id);
        dispatch(adminDeleteQBankQuestion(id))
            .unwrap()
            .then(() => {
                alert("Question deleted successfully")

                // refresh lists
                dispatch(adminFetchMockTestQuestions({ page: mockPage, limit }));
                dispatch(adminFetchQBankQuestions({ page: qBankPage, limit }));
            })
            .catch((err) => {
                alert("Failed to delete question")
            });
    };


    const handleDeleteTest = (testId) => {
        console.log("Deleting Test:", testId);

        dispatch(adminDeleteTest(testId))
            .unwrap()
            .then(() => {
                alert("Test deleted successfully");

                // refresh lists after deletion
                dispatch(adminFetchTestQuestions({ page: testPage, limit }));

            })
            .catch((err) => {
                console.error("Delete failed:", err);
                alert("Failed to delete test");
            });
    };


    // Data source based on tab
    const questions =
        activeTab === "Q-bank"
            ? adminQBankQuestions
            : activeTab === "Mock Test"
                ? adminMockTestQuestions
                : adminTestQuestions;

    // Filter (skip filtering for Test if unnecessary)
    const filteredQuestions = questions.filter(
        (q) =>
            (q.questionId?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
            ) ||
            (q.questionPreview?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
            ) ||
            (q.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // Pagination Handlers
    const handlePrev = () => {
        if (activeTab === "Q-bank" && qBankPage > 1) setQBankPage(qBankPage - 1);
        if (activeTab === "Mock Test" && mockPage > 1) setMockPage(mockPage - 1);
        if (activeTab === "Test" && testPage > 1) setTestPage(testPage - 1);
    };

    const handleNext = () => {
        if (activeTab === "Q-bank" && qBankPage < adminQBankTotalPages)
            setQBankPage(qBankPage + 1);
        if (activeTab === "Mock Test" && mockPage < adminMockTestTotalPages)
            setMockPage(mockPage + 1);
        if (activeTab === "Test" && testPage < adminTestQuestionsTotalPages)
            setTestPage(testPage + 1);
    };

    const getCurrentPage = () => {
        if (activeTab === "Q-bank") return qBankPage;
        if (activeTab === "Mock Test") return mockPage;
        return testPage;
    };

    const getTotalPages = () => {
        if (activeTab === "Q-bank") return adminQBankTotalPages;
        if (activeTab === "Mock Test") return adminMockTestTotalPages;
        return adminTestQuestionsTotalPages;
    };

    return (
        <div className="q-management-page">
            <div className="content-area">
                {/* Tabs */}
                <div className="controls-section">
                    <div className="tabs-container">
                        <div className="examtype-tabs">
                            <button
                                className={`tab-btn ${activeTab === "Q-bank" ? "active" : ""}`}
                                onClick={() => setActiveTab("Q-bank")}
                            >
                                Q-bank
                                <span className="tab-count">{adminQBankTotalCount}</span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "Mock Test" ? "active" : ""
                                    }`}
                                onClick={() => setActiveTab("Mock Test")}
                            >
                                Mock Test
                                <span className="tab-count">
                                    {adminMockTestTotalCount}
                                </span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "Test" ? "active" : ""}`}
                                onClick={() => setActiveTab("Test")}
                            >
                                Test
                                <span className="tab-count">{adminTestQuestionsTotalCount}</span>
                            </button>
                        </div>
                    </div>

                    {/* Search + Add */}
                    <div className="action-bar">
                        <div className="search-filter-section">
                            {/*  <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div> */}
                        </div>


                        {activeTab === "Test" && (
                            <button className="add-btn primary" onClick={handleAddTestClick}>
                                <FaPlus />
                                <span className="btn-text">Add Test</span>
                            </button>
                        )}

                        {activeTab === "Mock Test" && (
                            <button className="add-btn primary" onClick={handleAddQuestionClick}>
                                <FaPlus />
                                <span className="btn-text">Add Mock Test</span>
                            </button>
                        )}

                        {activeTab === "Q-bank" && (
                            <button className="add-btn primary" onClick={handleAddQuestionClick}>
                                <FaPlus />
                                <span className="btn-text">Add Question</span>
                            </button>
                        )}

                    </div>
                </div>

                {/* Table */}
                <div className="table-section">
                    <div className="table-container">
                        {activeTab === "Test" ? (
                            // ✅ Separate Table for Test Section
                            <table className="exam-table">
                                <thead>
                                    <tr>
                                        <th>Test ID</th>
                                        <th>Course</th>
                                        <th>Test Title</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminTestQuestions.map((t, index) => (
                                        <tr
                                            key={index}
                                            className={index % 2 === 1 ? "row-even" : "row-odd"}
                                        >
                                            <td>{t.id}</td>
                                            <td>{t.cs_name}</td>
                                            <td>{t.testTitle}</td>
                                            <td>{new Date(t.fromDate).toLocaleDateString("en-GB")}</td>
                                            <td>{new Date(t.toDate).toLocaleDateString("en-GB")}</td>

                                            <td>
                                                {/* <button
                                                    className="btn-icon-action btn-edit"
                                                    onClick={() => handleEdit(t.id)}
                                                >
                                                    <FaEdit />
                                                </button> */}
                                                <button
                                                    className="btn-icon-action btn-delete"
                                                    onClick={() => handleDeleteTest(t.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            // ✅ Existing Table for Q-bank & Mock Test
                            <table className="exam-table">
                                <thead>
                                    <tr>
                                        <th>Q-ID</th>
                                        <th>Course</th>
                                        <th>Preview</th>
                                        <th>Type</th>
                                        <th>Difficulty</th>
                                        <th>Actions</th>
                                        <th></th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQuestions.map((q, index) => (
                                        <tr
                                            key={index}
                                            className={index % 2 === 1 ? "row-even" : "row-odd"}
                                        >
                                            <td>{q.id}</td>
                                            <td>{q.cs_name}</td>
                                            <td>
                                                {q.question?.length > 150
                                                    ? q.question.substring(0, 150) + "..."
                                                    : q.question}
                                            </td>
                                            <td>{q.questionType}</td>
                                            <td>{q.difficulty}</td>
                                            <td>

                                                <button
                                                    className="btn-icon-action btn-delete"
                                                    onClick={() => handleDelete(q.id)}
                                                >
                                                    <FaTrash />
                                                </button>


                                            </td>
                                            <td>
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        px: 1.8,
                                                        py: .8,
                                                        bgcolor: "#2c3e50",
                                                        color: "white",
                                                        textTransform: "none",
                                                        display: "flex",       // ✅ Ensure flex layout
                                                        alignItems: "center",  // ✅ Align icon and text
                                                    }}
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleViewQuestion(q)}

                                                >
                                                    View
                                                </Button>
                                            </td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* ✅ Pagination for active tab */}
                <div className="pagination-controls">
                    <button disabled={getCurrentPage() === 1} onClick={handlePrev}>
                        Prev
                    </button>
                    <span>
                        Page {getCurrentPage()} of {getTotalPages() || 1}
                    </span>
                    <button
                        disabled={getCurrentPage() === getTotalPages()}
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QManagementPage;
