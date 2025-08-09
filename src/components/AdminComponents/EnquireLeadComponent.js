import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../features/contact/contactSlice";
import "../../styles/AdminStyles/EnquireLeadComponent.css";

const EnquireLeadComponent = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    // Provide fallback object so destructuring never fails
    const { list: contacts = [], loading = false, error = null } =
        useSelector(state => state.contacts || {});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    return (
        <div className="enquire-lead-page">
            <div className="content-area">
                {/* Filter Dropdown */}
                <div className="filter-section">
                    <div className="filter-dropdown">
                        <button
                            className="dropdown-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            All
                            <FaChevronDown
                                className={`dropdown-icon ${showDropdown ? "rotate" : ""}`}
                            />
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
                        {/* Loader/Error */}
                        {loading && (
                            <div style={{ textAlign: "center", padding: "1.5rem" }}>
                                Fetching enquiries...
                            </div>
                        )}
                        {error && (
                            <div style={{ textAlign: "center", color: "red", padding: "1.5rem" }}>
                                {error}
                            </div>
                        )}
                        {/* Desktop Table */}
                        {!loading && !error && contacts.length > 0 && (
                            <div className="desktop-table">
                                <table className="enquiries-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email / Phone</th>
                                            <th>Course Interested</th>
                                            <th>Message</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map((enquiry, index) => (
                                            <tr key={enquiry.cu_id || index} className={index % 2 === 1 ? "row-even" : "row-odd"}>
                                                <td className="cell-qid">{enquiry.cu_id || index + 1}</td>
                                                <td className="cell-preview">{enquiry.cu_name}</td>
                                                <td className="cell-contact">
                                                    {enquiry.cu_email} <br />{enquiry.cu_mobile}
                                                </td>
                                                <td className="cell-course">{enquiry.cu_course_interested}</td>
                                                <td className="cell-message">{enquiry.cu_message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {/* Empty state */}
                        {!loading && !error && contacts.length === 0 && (
                            <div style={{ textAlign: "center", color: "#888", padding: "3rem" }}>
                                No enquiries found.
                            </div>
                        )}

                        {/* Mobile Cards */}
                        {!loading && !error && contacts.length > 0 && (
                            <div className="mobile-cards">
                                {contacts.map((enquiry, index) => (
                                    <div key={enquiry.cu_id || index} className="enquiry-card">
                                        <div className="card-header">
                                            <span className="qid-badge">{enquiry.cu_id || index + 1}</span>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-preview">{enquiry.cu_name}</p>
                                            <div className="card-details">
                                                <div className="detail-row">
                                                    <strong>Email:</strong> {enquiry.cu_email}
                                                </div>
                                                <div className="detail-row">
                                                    <strong>Phone:</strong> {enquiry.cu_mobile}
                                                </div>
                                                <div className="detail-row">
                                                    <strong>Course:</strong> {enquiry.cu_course_interested}
                                                </div>
                                                <div className="detail-row">
                                                    <strong>Message:</strong> {enquiry.cu_message}
                                                </div>
                                                {/* Optionally, show status or created_at:
                        <div className="detail-row">
                          <strong>Status:</strong> {enquiry.cu_status}
                        </div>
                        <div className="detail-row">
                          <strong>Date:</strong> {new Date(enquiry.cu_created_at).toLocaleString()}
                        </div>
                        */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnquireLeadComponent;
