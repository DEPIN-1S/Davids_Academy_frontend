import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaFilter, FaSearch } from "react-icons/fa";
import QuestionFlowManager from "../../components/AdminComponents/QuestionFlowManager";
import { adminFetchQBankQuestions } from "../../features/exam/examSlice";
import { adminFetchMockTestQuestions } from "../../features/exam/examSlice";
import { adminFetchTestQuestions } from "../../features/exam/examSlice"




import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
} from "@mui/material";
import "../../styles/AdminStyles/QManagement.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { listQuestionTypes, getTestQuestions } from "../../features/exam/examSlice";

const QManagementPage = () => {
    const dispatch = useDispatch();

    // Pull test questions from redux state
    const {
        adminQBankQuestions,
        adminQBankQuestionsLoading,
        adminQBankQuestionsError,
    } = useSelector((state) => state.exam);

    const {
        adminMockTestQuestions,
        adminMockTestQuestionsLoading,
        adminMockTestQuestionsError
    } = useSelector((state) => state.exam);

    const {
        adminTestQuestions,
        adminTestQuestionsLoading,
        adminTestQuestionsError
    } = useSelector(state => state.exam);




    useEffect(() => {
        dispatch(adminFetchQBankQuestions());
        dispatch(adminFetchMockTestQuestions());
        dispatch(adminFetchTestQuestions());
    }, [dispatch]);

    useEffect(() => {
        console.log("✅ Test Questions :::", adminTestQuestions);
        console.log("mock test questions ::" ,adminMockTestQuestions, );
        
    }, [adminQBankQuestions, adminMockTestQuestions, adminTestQuestions]);


    const mockTestData = [
        {
            questionId: "M001",
            questionPreview: "What is the correct sequence for...",
            type: "MCQ",
            difficulty: "Hard",
        },
        {
            questionId: "M002",
            questionPreview: "Priority nursing intervention for...",
            difficulty: "Hard",
        },
    ];

    // New test table data for Test tab
    const testTableData = [
        {
            id: "T001",
            title: "Midterm Nursing Exam",
            startDate: "2025-08-19",
            endDate: "2025-08-21",
        },
        {
            id: "T002",
            title: "Final Practice Exam",
            startDate: "2025-08-25",
            endDate: "2025-08-27",
        },
    ];

    useEffect(() => {
        dispatch(getTestQuestions());
    }, [dispatch]);

    const [activeTab, setActiveTab] = useState("Q-bank");
    const [showModal, setShowModal] = useState(false);
    const [selectedType, setSelectedType] = useState("classic");
    const [showQuestionFlow, setShowQuestionFlow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const navigate = useNavigate();

    const handleAddQuestionClick = () => {
        navigate('/admin/selectCourse');
    };
    const handleAddTestClick = () => {
        navigate('/admin/add-test');
    };

    const handleView = (questionId) => {
        console.log("View question:", questionId);
    };

    const handleEdit = (id) => {
        if (activeTab === "Test") {
            console.log("Edit test:", id);
            // Navigate or show modal to edit test
        } else {
            console.log("Edit question:", id);
            // Navigate or show modal to edit question
        }
    };

    const handleDelete = (id) => {
        if (activeTab === "Test") {
            console.log("Delete test:", id);
            // Confirm and delete test
        } else {
            console.log("Delete question:", id);
            // Confirm and delete question
        }
    };

    // Data source based on tab
    /*     const questions = activeTab === "Q-bank" ? qBankData : activeTab === "Mock Test" ? mockTestData : []; */
    const questions = activeTab === "Q-bank" ? adminQBankQuestions : adminMockTestQuestions;


    // Filter questions (skip filtering for Test tab)
    const filteredQuestions = activeTab === "Test"
        ? adminTestQuestions
        : questions.filter(q =>
            (q.questionId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (q.questionPreview?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (q.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );


    return (
        <div className="q-management-page">

            {/* Content Area */}
            <div className="content-area">
                {showQuestionFlow ? (
                    <QuestionFlowManager />
                ) : (
                    <>
                        {/* Controls Section */}
                        <div className="controls-section">
                            {/* Tabs */}
                            <div className="tabs-container">
                                <div className="examtype-tabs">
                                    <button
                                        className={`tab-btn ${activeTab === "Q-bank" ? "active" : ""}`}
                                        onClick={() => setActiveTab("Q-bank")}
                                    >
                                        Q-bank
                                        <span className="tab-count">{adminQBankQuestions.length}</span>
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === "Mock Test" ? "active" : ""}`}
                                        onClick={() => setActiveTab("Mock Test")}
                                    >
                                        Mock Test
                                        <span className="tab-count">{adminMockTestQuestions.length}</span>
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === "Test" ? "active" : ""}`}
                                        onClick={() => setActiveTab("Test")}
                                    >
                                        Test
                                        <span className="tab-count">{testTableData.length}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="action-bar">
                                <div className="search-filter-section">
                                    <div className="search-box">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search questions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                    <button
                                        className="filter-btn"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <FaFilter />
                                        <span className="btn-text">Filter</span>
                                    </button>
                                </div>
                                {activeTab === "Test" ? (
                                    <button className="add-btn primary" onClick={handleAddTestClick}>
                                        <FaPlus />
                                        <span className="btn-text">Add Test</span>
                                    </button>
                                ) : (
                                    <button className="add-btn primary" onClick={handleAddQuestionClick}>
                                        <FaPlus />
                                        <span className="btn-text">Add Question</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="table-section">
                            {activeTab !== "Test" && (
                                <div className="table-container">
                                    <div className="desktop-table">
                                        <table className="exam-table">
                                            <thead>
                                                <tr>
                                                    <th>Q-ID</th>
                                                    <th>Preview</th>
                                                    <th>Type</th>
                                                    <th>Difficulty</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredQuestions.map((q, index) => (
                                                    <tr key={index} className={index % 2 === 1 ? "row-even" : "row-odd"}>
                                                        <td className="cell-qid">{q.id}</td>
                                                        <td className="cell-preview">
                                                            {q.question
                                                                ? q.question.length > 150
                                                                    ? q.question.substring(0, 150) + "..."
                                                                    : q.question
                                                                : q.questionPreview || ""}
                                                        </td>

                                                        <td className="cell-type">{q.type}</td>
                                                        <td className="cell-difficulty">{q.difficulty}</td>
                                                        <td className="cell-actions">
                                                            <div className="action-group">
                                                                <button className="btn-view-test" onClick={() => handleView(q.questionId)}>View Test</button>
                                                                <button
                                                                    className="btn-icon-action btn-edit"
                                                                    onClick={() => handleEdit(q.questionId)}
                                                                    title="Edit"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    className="btn-icon-action btn-delete"
                                                                    onClick={() => handleDelete(q.questionId)}
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="mobile-cards">
                                        {filteredQuestions.map((q, index) => (
                                            <div key={index} className="question-card">
                                                <div className="card-header">
                                                    <span className="question-id">{q.questionId}</span>
                                                    <div className="card-badges">
                                                        <span className="type-badge">{q.type}</span>
                                                        <span className="difficulty-badge">{q.difficulty}</span>
                                                    </div>
                                                </div>
                                                <div className="card-content">
                                                    <p className="question-preview">{q.questionPreview}</p>
                                                </div>
                                                <div className="card-actions">
                                                    <button className="btn-view-test" onClick={() => handleView(q.questionId)}>View Test</button>
                                                    <button className="btn-icon-action btn-edit" onClick={() => handleEdit(q.questionId)}>
                                                        <FaEdit />
                                                    </button>
                                                    <button className="btn-icon-action btn-delete" onClick={() => handleDelete(q.questionId)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Test Tab Table */}
                            {/* {activeTab === "Test" && (
                                <div className="table-container">
                                    <div className="desktop-table">
                                        <table className="exam-table">
                                            <thead>
                                                <tr>
                                                    <th>Test Title</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                               
                                                    {adminTestQuestions?.list?.map((test) => (
                                                        <tr key={test.id}>
                                                            <td>{test.testTitle}</td>
                                                            <td>{test.fromDate}</td>
                                                            <td>{test.toDate}</td>
                                                            <td>
                                                                <button
                                                                    className="btn-icon-action btn-edit"
                                                                    title="Edit"
                                                                    onClick={() => handleEdit(test.id)}
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    className="btn-icon-action btn-delete"
                                                                    title="Delete"
                                                                    onClick={() => handleDelete(test.id)}
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                               

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )} */}


                            {activeTab === "Test" && (
                                <div className="table-container">
                                    <div className="desktop-table">
                                        <table className="exam-table">
                                            <thead>
                                                <tr>
                                                    <th>Test Title</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>


                                                {
                                                    adminTestQuestions.length > 0 ? (
                                                        adminTestQuestions.map((test) => (
                                                            <tr key={test.id}>
                                                                <td>{test.testTitle}</td>
                                                                <td>{test.fromDate}</td>
                                                                <td>{test.toDate}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn-icon-action btn-edit"
                                                                        title="Edit"
                                                                        onClick={() => handleEdit(test.id)}
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        className="btn-icon-action btn-delete"
                                                                        title="Delete"
                                                                        onClick={() => handleDelete(test.id)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" style={{ textAlign: "center" }}>
                                                                No tests found
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Empty State */}
                        {filteredQuestions.length === 0 && (
                            <div className="empty-state">
                                <h3>No questions found</h3>
                                <p>Try adjusting your search or add a new question.</p>
                                <button className="add-btn primary" onClick={handleAddQuestionClick}>
                                    <FaPlus /> Add Question
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QManagementPage;
