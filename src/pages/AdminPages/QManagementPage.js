import React, { useState } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import QuestionFlowManager from "../../components/AdminComponents/QuestionFlowManager"; // Adjust path as needed
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
const QManagementPage = () => {
    const [activeTab, setActiveTab] = useState("Q-bank");
    const [showModal, setShowModal] = useState(false);
    const [selectedType, setSelectedType] = useState("classic");
    const [showQuestionFlow, setShowQuestionFlow] = useState(false);
    const qBankData = [
        {
            questionId: "Q001",
            questionPreview: "Which medication is safest for...",
            type: "MCQ",
            subject: "Fundamentals",
            lesson: "123@Skills/Procedures",
            clientNeedArea: "Safety & Infection Control",
            clientNeedTopic: "Infection Prevention",
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
    ];

    const questions = activeTab === "Q-bank" ? qBankData : mockTestData;
    const navigate = useNavigate();
    const handleAddQuestionClick = () => {
        navigate('/admin/create-question');
    };

    const handleModalClose = () => {
        setShowModal(false);
    };
    const handleNextClick = () => {
        console.log("Selected type:", selectedType);
        setShowModal(false);
        navigate('/admin/question-type');
        // You can redirect or update state based on selectedType
    };

    return (
        <div className="table-wrapper">
            <div className="table-header">
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === "Q-bank" ? "active" : ""}`}
                        onClick={() => setActiveTab("Q-bank")}
                    >
                        Q-bank
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "Mock Test" ? "active" : ""}`}
                        onClick={() => setActiveTab("Mock Test")}
                    >
                        Mock Test
                    </button>
                </div>
                <button className="add-btn" onClick={handleAddQuestionClick}>
                    <FaPlus style={{ marginRight: "5px" }} />
                    Add Question
                </button>
            </div>
            {showQuestionFlow ? (
                <QuestionFlowManager />
            ) : (
                <div className="table-container">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Q-ID</th>
                                <th>Preview</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Lesson</th>
                                <th>Client Need Area</th>
                                <th>Client Need Topic</th>
                                <th>Difficulty</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q, index) => (
                                <tr key={index} className={index % 2 === 1 ? "striped" : ""}>
                                    <td>{q.questionId}</td>
                                    <td>{q.questionPreview}</td>
                                    <td>{q.type}</td>
                                    <td>{q.subject}</td>
                                    <td>{q.lesson}</td>
                                    <td>{q.clientNeedArea}</td>
                                    <td>{q.clientNeedTopic}</td>
                                    <td>{q.difficulty}</td>
                                    <td className="action-buttons">
                                        <button className="progress-btn">View</button>
                                        <button className="delete-btn">
                                            <FaTrash />
                                        </button>
                                        <button className="edit-btn">
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QManagementPage;
