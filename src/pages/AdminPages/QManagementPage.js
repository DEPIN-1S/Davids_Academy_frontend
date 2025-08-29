import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { adminFetchQBankQuestions, adminFetchMockTestQuestions, adminFetchTestQuestions, getTestQuestions, } from "../../features/exam/examSlice";
import "../../styles/AdminStyles/QManagement.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const QManagementPage = () => {
    const dispatch = useDispatch();

    // Redux state
    const {
        adminQBankQuestions,
        adminQBankTotalPages,
    } = useSelector((state) => state.exam);

    const {
        adminMockTestQuestions,
        adminMockTestTotalPages,
    } = useSelector((state) => state.exam);

    const {
        adminTestQuestions,
        adminTestTotalPages,
    } = useSelector((state) => state.exam);


    const [qBankPage, setQBankPage] = useState(1);
    const [mockPage, setMockPage] = useState(1);
    const [testPage, setTestPage] = useState(1);
    const limit = 10;

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
        dispatch(adminFetchTestQuestions({ page: testPage, limit }));
    }, [dispatch, testPage]);

    useEffect(() => {
        dispatch(getTestQuestions());
    }, [dispatch]);

    // Tabs & Search
    const [activeTab, setActiveTab] = useState("Q-bank");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Handlers
    const handleAddQuestionClick = () => navigate("/admin/selectCourse");
    const handleAddTestClick = () => navigate("/admin/add-test");
    const handleEdit = (id) => console.log("Edit:", id);
    const handleDelete = (id) => console.log("Delete:", id);

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
        if (activeTab === "Test" && testPage < adminTestTotalPages)
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
        return adminTestTotalPages;
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
                                <span className="tab-count">{adminQBankQuestions.length}</span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "Mock Test" ? "active" : ""
                                    }`}
                                onClick={() => setActiveTab("Mock Test")}
                            >
                                Mock Test
                                <span className="tab-count">
                                    {adminMockTestQuestions.length}
                                </span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "Test" ? "active" : ""}`}
                                onClick={() => setActiveTab("Test")}
                            >
                                Test
                                <span className="tab-count">{adminTestQuestions.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Search + Add */}
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
                        </div>
                        {activeTab === "Test" ? (
                            <button className="add-btn primary" onClick={handleAddTestClick}>
                                <FaPlus />
                                <span className="btn-text">Add Test</span>
                            </button>
                        ) : (
                            <button
                                className="add-btn primary"
                                onClick={handleAddQuestionClick}
                            >
                                <FaPlus />
                                <span className="btn-text">Add Question</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="table-section">
                    <div className="table-container">
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
                                    <tr
                                        key={index}
                                        className={index % 2 === 1 ? "row-even" : "row-odd"}
                                    >
                                        <td>{q.id}</td>
                                        <td>
                                            {q.question?.length > 150
                                                ? q.question.substring(0, 150) + "..."
                                                : q.question}
                                        </td>
                                        <td>{q.type}</td>
                                        <td>{q.difficulty}</td>
                                        <td>
                                            <button
                                                className="btn-icon-action btn-edit"
                                                onClick={() => handleEdit(q.id)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn-icon-action btn-delete"
                                                onClick={() => handleDelete(q.id)}
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
