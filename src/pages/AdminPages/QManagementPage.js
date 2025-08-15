import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaEye, FaFilter, FaSearch } from "react-icons/fa";
import QuestionFlowManager from "../../components/AdminComponents/QuestionFlowManager";
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
import { listQuestionTypes } from "../../features/exam/examSlice";


const QManagementPage = () => {

    const dispatch = useDispatch();
    const { questionTypes, questionTypesLoading, questionTypesError } = useSelector(
        (state) => state.exam
    );


    useEffect(() => {
        dispatch(listQuestionTypes());   
    }, [dispatch]);

    const [activeTab, setActiveTab] = useState("Q-bank");
    const [showModal, setShowModal] = useState(false);
    const [selectedType, setSelectedType] = useState("classic");
    const [showQuestionFlow, setShowQuestionFlow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const qBankData = [
        {
            questionId: "Q0175",
            questionPreview: "Which medication is safest for...",
            type: "MCQ",
            subject: "Fundamentals",
            lesson: "Skills/Procedures",
            clientNeedArea: "Reduction of Risk Potential",
            clientNeedTopic: "Potential for Complications of Diagnostic Tests/Treatments/Procedures",
            difficulty: "Medium",
        },
        {
            questionId: "Q0175",
            questionPreview: "Which medication is safest for...",
            type: "MCQ",
            subject: "Fundamentals",
            lesson: "Skills/Procedures",
            clientNeedArea: "Reduction of Risk Potential",
            clientNeedTopic: "Potential for Complications of Diagnostic Tests/Treatments/Procedures",
            difficulty: "Medium",
        },
        {
            questionId: "Q0175",
            questionPreview: "Which medication is safest for...",
            type: "MCQ",
            subject: "Fundamentals",
            lesson: "Skills/Procedures",
            clientNeedArea: "Reduction of Risk Potential",
            clientNeedTopic: "Potential for Complications of Diagnostic Tests/Treatments/Procedures",
            difficulty: "Medium",
        },
        {
            questionId: "Q0175",
            questionPreview: "Which medication is safest for...",
            type: "MCQ",
            subject: "Fundamentals",
            lesson: "Skills/Procedures",
            clientNeedArea: "Reduction of Risk Potential",
            clientNeedTopic: "Potential for Complications of Diagnostic Tests/Treatments/Procedures",
            difficulty: "Medium",
        },
    ];

    const mockTestData = [
        {
            questionId: "M001",
            questionPreview: "What is the correct sequence for...",
            type: "MCQ",
            subject: "Pharmacology",
            lesson: "Dosage Calculation",
            clientNeedArea: "Pharmacological Therapies",
            clientNeedTopic: "Dosage Admin",
            difficulty: "Hard",
        },
        {
            questionId: "M002",
            questionPreview: "Priority nursing intervention for...",
            type: "MCQ",
            subject: "Critical Care",
            lesson: "Emergency Procedures",
            clientNeedArea: "Management of Care",
            clientNeedTopic: "Priority Setting",
            difficulty: "Hard",
        },
    ];

    const questions = activeTab === "Q-bank" ? qBankData : mockTestData;
    const navigate = useNavigate();

    const handleAddQuestionClick = () => {
        navigate('/admin/selectCourse');
    };

    const handleView = (questionId) => {
        console.log("View question:", questionId);
    };

    const handleEdit = (questionId) => {
        console.log("Edit question:", questionId);
    };

    const handleDelete = (questionId) => {
        console.log("Delete question:", questionId);
    };

    const filteredQuestions = questions.filter(q =>
        q.questionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.questionPreview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchTerm.toLowerCase())
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
                                        <span className="tab-count">{qBankData.length}</span>
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === "Mock Test" ? "active" : ""}`}
                                        onClick={() => setActiveTab("Mock Test")}
                                    >
                                        Mock Test
                                        <span className="tab-count">{mockTestData.length}</span>
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

                                <button className="add-btn primary" onClick={handleAddQuestionClick}>
                                    <FaPlus />
                                    <span className="btn-text">Add Question</span>
                                </button>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="table-section">
                            <div className="table-container">
                                {/* Desktop Table */}
                                <div className="desktop-table">
                                    <table className="exam-table">
                                        <thead>
                                            <tr>
                                                <th>Q-ID</th>
                                                <th>Preview</th>
                                                <th>Type</th>
                                                <th>Subject</th>
                                                <th className="hide-md">Lesson</th>
                                                <th className="hide-lg">Client Need Area</th>
                                                <th className="hide-xl">Client Need Topic</th>
                                                <th>Difficulty</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredQuestions.map((q, index) => (
                                                <tr key={index} className={index % 2 === 1 ? "row-even" : "row-odd"}>
                                                    <td className="cell-qid">{q.questionId}</td>
                                                    <td className="cell-preview">{q.questionPreview}</td>
                                                    <td className="cell-type">{q.type}</td>
                                                    <td className="cell-subject">{q.subject}</td>
                                                    <td className="hide-md">{q.lesson}</td>
                                                    <td className="hide-lg">{q.clientNeedArea}</td>
                                                    <td className="hide-xl">{q.clientNeedTopic}</td>
                                                    <td className="cell-difficulty">{q.difficulty}</td>
                                                    <td className="cell-actions">
                                                        <div className="action-group">
                                                            <button className="btn-view-test">View Test</button>
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
                                                <div className="card-details">
                                                    <div className="detail-item">
                                                        <strong>Subject:</strong> {q.subject}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Lesson:</strong> {q.lesson}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Client Need:</strong> {q.clientNeedArea}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-actions">
                                                <button className="btn-view-test">View Test</button>
                                                <button className="btn-icon-action btn-edit">
                                                    <FaEdit />
                                                </button>
                                                <button className="btn-icon-action btn-delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QManagementPage;
