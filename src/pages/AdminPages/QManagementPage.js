import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaSearch, FaWhatsapp } from "react-icons/fa";
import { adminFetchQBankQuestions, adminFetchMockTestQuestions, adminFetchTestQuestions, getTestQuestions, adminDeleteQBankQuestion, adminDeleteTest, adminUpdateTestThunk } from "../../features/exam/examSlice";
import "../../styles/AdminStyles/QManagement.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal, Box, Button, TextField } from "@mui/material";
import { stripHtml } from "../../utils/htmlHelper";
import { buildChannelCaption, getChannelQuestionUrl } from "../../config/whatsapp";


const QManagementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [testEditData, setTestEditData] = useState({
        testTitle: "",
        fromDate: "",
        toDate: "",
        courseId: "",
        questionIds: []
    })


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

    const handleCopyChannelLink = async (questionId) => {
        const caption = buildChannelCaption(questionId);
        try {
            await navigator.clipboard.writeText(caption);
            toast.success(`Copied Channel caption for Q-${questionId}`);
        } catch {
            window.prompt("Copy this caption for WhatsApp Channel:", caption);
        }
    };

    const handleViewQuestion = (questionData) => {
        console.log("Question Data in question view", questionData);
        const { questionType } = questionData;
        const questionId = questionData.id;
        console.log("question Id :::", questionId);


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
                navigate(`/admin/fillInTheBlanks-question-view/${questionId}`);
                break;
            case 'Sentence Highlight':
                navigate(`/admin/SentenceHighlight-question-view/${questionId}`);
                break;
            case 'Sorting':
                navigate(`/admin/Sorting-question-view/${questionId}`);
                break;

            case 'Table Dropdown':
                navigate(`/admin/TableDropdown-question-view/${questionId}`);

                /*  path="/admin/TableDropdown-question-view/:questionId"  */
                break;

            case 'Table Highlight':
                navigate(`/admin/TableHighlight-question-view/${questionId}`);
                /*     path="/admin/TableHighlight-question-view/:questionId" */
                break;

            case 'Multidropdown':
                navigate(`/admin/MultiDropdown-question-view/${questionId}`);
                /* "/admin/MultiDropdown-question-view/:questionId" */
                break;

            default:
                console.warn('Unknown question type:', questionType);
                break;
        }
    };

    const handleEditQuestion = (questionData) => {
        console.log("Edit question Data:", questionData);
        const { questionType, id, courseId, topic_id, exam_type, question_type_id } = questionData;
        const navState = {
            questionId: id,
            isEdit: true,
            questionData,
            cs_id: courseId || questionData.cs_id || 1,
            topic_id: topic_id || questionData.topicId || 1,
            exam_type: exam_type || "q-bank",
            question_type_id: question_type_id || 1,
            questionType
        };

        // ✅ CRITICAL: Store question ID in sessionStorage so it survives across all navigation steps
        sessionStorage.setItem('editingQuestionId', String(id));
        sessionStorage.setItem('editingQuestionType', questionType);
        console.log('✅ Stored editingQuestionId in sessionStorage:', id);


        switch (questionType) {
            case 'MCQ':
                navigate(`/admin/mcq-content`, { state: navState });
                break;
            case 'Dropdown':
                navigate(`/admin/dropdown-content`, { state: navState });
                break;
            case 'Drag Drop':
                navigate(`/admin/dragdrop-content`, { state: navState });
                break;
            case 'Multiple Radio':
                navigate(`/admin/multiradio-content`, { state: navState });
                break;
            case 'Fill in the Blanks':
                navigate(`/admin/fill-content`, { state: navState });
                break;
            case 'Sentence Highlight':
                navigate(`/admin/sentence-content`, { state: navState });
                break;
            case 'Sorting':
                navigate(`/admin/sort-content`, { state: navState });
                break;
            case 'Table Dropdown':
                navigate(`/admin/table-dropDown`, { state: navState });
                break;
            case 'Table Highlight':
                navigate(`/admin/table-Highlight`, { state: navState });
                break;
            case 'Multidropdown':
            case 'Multi-Dropdown':
            case 'Multi Dropdown':
                navigate(`/admin/multiDropDown`, { state: navState });
                break;
            default:
                handleViewQuestion(questionData);
                break;
        }
    };

    const handleEdit = (test) => {
        console.log("test:::::::i2345678",test);
        
        setSelectedTest(test);
        setTestEditData({
            testTitle: test.testTitle,
            fromDate: test.fromDate?.split('T')[0] || "", // format for date input
            toDate: test.toDate?.split('T')[0] || "",
            courseId: test.courseId || test.cs_id || "",
            questionIds: test.questionIds || []
        });
        setEditModalOpen(true);
    };

    const handleSaveTestEdit = () => {
        if (!selectedTest) return;

        dispatch(
            adminUpdateTestThunk({
                testId: selectedTest.id,
                updatedData: {
                    testTitle: testEditData.testTitle,
                    fromDate: testEditData.fromDate,
                    toDate: testEditData.toDate,
                    courseId: testEditData.courseId, 
                    questionIds: testEditData.questionIds
                }
            })
        )
            .unwrap()
            .then(() => {
                toast.success("Test updated successfully");
                setEditModalOpen(false);
                // Refresh the test list after update
                dispatch(adminFetchTestQuestions({ page: testPage, limit }));
            })
            .catch((err) => {
                toast.error("Failed to update test: " + err);
            });
    };



    // Tabs & Search
    const [activeTab, setActiveTab] = useState("Q-bank");
    const [searchTerm, setSearchTerm] = useState("");

    // Reset pagination to page 1 when searching
    useEffect(() => {
        if (qBankPage !== 1) setQBankPage(1);
        if (mockPage !== 1) setMockPage(1);
        if (testPage !== 1) setTestPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    // ✅ Fetch when page or search changes
    useEffect(() => {
        dispatch(adminFetchQBankQuestions({ page: qBankPage, limit, search: searchTerm }));
    }, [dispatch, qBankPage, limit, searchTerm]);

    useEffect(() => {
        dispatch(adminFetchMockTestQuestions({ page: mockPage, limit, search: searchTerm }));
    }, [dispatch, mockPage, limit, searchTerm]);

    useEffect(() => {
        console.log("✅ Fetching Test questions :::", testPage);

        dispatch(adminFetchTestQuestions({ page: testPage, limit }));
        console.log("Fetching test questions limit ::: ", limit, testPage);

    }, [dispatch, testPage]);

    useEffect(() => {
        dispatch(getTestQuestions());
    }, [dispatch]);




    // Handlers
    const handleAddQuestionClick = () => {
        sessionStorage.removeItem('editingQuestionId');
        sessionStorage.removeItem('editingQuestionType');
        navigate("/admin/selectCourse");
    };
    const handleAddTestClick = () => navigate("/admin/add-test");


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

    // Filter
    const filteredQuestions = (questions || []).filter((q) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase().trim();
        return (
            String(q.id || "").includes(term) ||
            (q.cs_name?.toLowerCase() || "").includes(term) ||
            (q.topic_name?.toLowerCase() || "").includes(term) ||
            (stripHtml(q.question)?.toLowerCase() || "").includes(term) ||
            (q.questionType?.toLowerCase() || "").includes(term) ||
            (q.difficulty?.toLowerCase() || "").includes(term) ||
            (q.testTitle?.toLowerCase() || "").includes(term)
        );
    });

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
        <div className="q-management-page q-management-futuristic">
            <div className="content-area">
                {/* Tabs */}
                <div className="controls-section">
                    <div className="tabs-container">
                        <div className="examtype-tabs">
                            <button
                                className={`tab-btn ${activeTab === "Q-bank" ? "active" : ""}`}
                                onClick={() => setActiveTab("Q-bank")}
                            >
                                Questions(Q-bank)
                                <span className="tab-count">{adminQBankTotalCount}</span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "Mock Test" ? "active" : ""
                                    }`}
                                onClick={() => setActiveTab("Mock Test")}
                            >
                                Questions(Mock Test)
                                <span className="tab-count">
                                    {adminMockTestTotalCount}
                                </span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "Test" ? "active" : ""}`}
                                onClick={() => setActiveTab("Test")}
                            >
                                Mock Test
                                <span className="tab-count">{adminTestQuestionsTotalCount}</span>
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
                                    className="search-input"
                                    placeholder="Search by Q-ID, Course, Topic, Question text..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
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
                                        <th>Title</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminTestQuestions.map((t, index) => (
                                        <tr
                                            key={index}
                                            className={index % 2 === 1 ? "row-even" : "row-odd"}
                                            style={{ animationDelay: `${index * 0.04}s` }}
                                        >
                                            <td>{t.id}</td>
                                            <td>{t.cs_name}</td>
                                            <td>{t.testTitle}</td>
                                            <td>{new Date(t.fromDate).toLocaleDateString("en-GB")}</td>
                                            <td>{new Date(t.toDate).toLocaleDateString("en-GB")}</td>

                                            <td>
                                                <div className="question-management-action-btn" >
                                                    <button
                                                        className="btn-icon-action btn-edit"
                                                        onClick={() => handleEdit(t)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn-icon-action btn-delete"
                                                        onClick={() => handleDeleteTest(t.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
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
                                        <th>Topic</th>
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
                                            style={{ animationDelay: `${index * 0.04}s` }}
                                        >
                                            <td>{q.id}</td>
                                            <td>{q.cs_name}</td>
                                            <td>{q.topic_name || "-"}</td>
                                            <td>
                                                {stripHtml(q.question)?.length > 150
                                                    ? stripHtml(q.question).substring(0, 150) + "..."
                                                    : stripHtml(q.question)}
                                            </td>
                                            <td>{q.questionType}</td>
                                            <td>
                                                <span className={`difficulty-pill ${(q.difficulty || "").toLowerCase()}`}>
                                                    {q.difficulty}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="question-management-action-btn">
                                                    <button
                                                        className="btn-icon-action btn-edit"
                                                        title="Edit Question"
                                                        onClick={() => handleEditQuestion(q)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn-icon-action btn-delete"
                                                        title="Delete Question"
                                                        onClick={() => handleDelete(q.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="view-btn"
                                                    onClick={() => handleViewQuestion(q)}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="copy-channel-btn"
                                                    title={getChannelQuestionUrl(q.id)}
                                                    onClick={() => handleCopyChannelLink(q.id)}
                                                >
                                                    <FaWhatsapp />
                                                    Copy
                                                </button>
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

            <Modal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                aria-labelledby="edit-question-modal"
                aria-describedby="edit-question-modal-description"
            >
                <Box
                    className="question-editor-futuristic question-editor-modal"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        maxWidth: '90%',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h4 style={{ display: "flex", alignItems: "center", justifyContent: "center" }} id="edit-question-modal">Edit Test</h4>

                    {selectedTest && (
                        <div>
                            <p><strong>Q-ID:</strong> {selectedTest.id}</p>
                            <p><strong>Test Name:</strong> {selectedTest.testTitle}</p>

                            <TextField
                                label="Test Title"
                                fullWidth
                                sx={{ mt: 1 }}
                                value={testEditData.testTitle}
                                onChange={(e) =>
                                    setTestEditData({ ...testEditData, testTitle: e.target.value })
                                }
                            />

                            <TextField
                                label="Start Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{ mt: 2 }}
                                value={testEditData.fromDate}
                                onChange={(e) =>
                                    setTestEditData({ ...testEditData, fromDate: e.target.value })
                                }
                            />

                            <TextField
                                label="End Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{ mt: 2 }}
                                value={testEditData.toDate}
                                onChange={(e) =>
                                    setTestEditData({ ...testEditData, toDate: e.target.value })
                                }
                            />


                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: "20px" }}>

                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "#2c3e50" }}

                                    onClick={handleSaveTestEdit}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default QManagementPage;
