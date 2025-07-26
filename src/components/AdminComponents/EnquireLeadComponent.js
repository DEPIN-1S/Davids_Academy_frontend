import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "../../styles/AdminStyles/EnquireLeadComponent.css";

const EnquireLeadComponent = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const enquiriesData = [
        {
            qId: "00125",
            questionPreview: "Which medication is safest for...",
            emailPhone: "MCQ",
            courseInterested: "Fundamentals",
            message: "Want to know about class timing"
        },
        {
            qId: "00125",
            questionPreview: "Which medication is safest for...",
            emailPhone: "MCQ",
            courseInterested: "Fundamentals",
            message: "Want to know about class timing"
        },
        {
            qId: "00125",
            questionPreview: "Which medication is safest for...",
            emailPhone: "MCQ",
            courseInterested: "Fundamentals",
            message: "Want to know about class timing"
        },
        {
            qId: "00125",
            questionPreview: "Which medication is safest for...",
            emailPhone: "MCQ",
            courseInterested: "Fundamentals",
            message: "Want to know about class timing"
        }
    ];

    return (
        <div className="enquire-lead-page">
            {/* Content Area */}
            <div className="content-area">
                {/* Filter Dropdown */}
                <div className="filter-section">
                    <div className="filter-dropdown">
                        <button
                            className="dropdown-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            All
                            <FaChevronDown className={`dropdown-icon ${showDropdown ? 'rotate' : ''}`} />
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item active">All</div>
                                <div className="dropdown-item">New</div>
                                <div className="dropdown-item">In Progress</div>
                                <div className="dropdown-item">Completed</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-section">
                    <div className="table-container">
                        {/* Desktop Table */}
                        <div className="desktop-table">
                            <table className="enquiries-table">
                                <thead>
                                    <tr>
                                        <th>Q-ID</th>
                                        <th>Question Preview</th>
                                        <th>Email / Phone</th>
                                        <th>Course Interested</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiriesData.map((enquiry, index) => (
                                        <tr key={index} className={index % 2 === 1 ? "row-even" : "row-odd"}>
                                            <td className="cell-qid">{enquiry.qId}</td>
                                            <td className="cell-preview">{enquiry.questionPreview}</td>
                                            <td className="cell-contact">{enquiry.emailPhone}</td>
                                            <td className="cell-course">{enquiry.courseInterested}</td>
                                            <td className="cell-message">{enquiry.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="mobile-cards">
                            {enquiriesData.map((enquiry, index) => (
                                <div key={index} className="enquiry-card">
                                    <div className="card-header">
                                        <span className="qid-badge">{enquiry.qId}</span>
                                    </div>

                                    <div className="card-body">
                                        <p className="card-preview">{enquiry.questionPreview}</p>
                                        <div className="card-details">
                                            <div className="detail-row">
                                                <strong>Contact:</strong> {enquiry.emailPhone}
                                            </div>
                                            <div className="detail-row">
                                                <strong>Course:</strong> {enquiry.courseInterested}
                                            </div>
                                            <div className="detail-row">
                                                <strong>Message:</strong> {enquiry.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnquireLeadComponent;
