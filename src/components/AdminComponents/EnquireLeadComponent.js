import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../features/contact/contactSlice";
import "../../styles/AdminStyles/EnquireLeadComponent.css";

const EnquireLeadComponent = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    // Get Redux contacts data
    const dispatch = useDispatch();
    const { list: contacts, loading, error } = useSelector(
        (state) => state.contacts
    );

    // Fetch contacts on mount
    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    // Optionally, you could implement filters here
    // For now, just list all contacts

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
                        {!loading && !error && contacts?.length > 0 && (
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
                                            <tr key={enquiry.id || index} className={index % 2 === 1 ? "row-even" : "row-odd"}>
                                                <td className="cell-qid">{enquiry.id || index + 1}</td>
                                                <td className="cell-preview">{enquiry.name}</td>
                                                <td className="cell-contact">
                                                    {enquiry.email} <br />{enquiry.phone}
                                                </td>
                                                <td className="cell-course">{enquiry.subject}</td>
                                                <td className="cell-message">{enquiry.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {/* Empty state */}
                        {!loading && !error && (!contacts || contacts.length === 0) && (
                            <div style={{ textAlign: "center", color: "#888", padding: "3rem" }}>
                                No enquiries found.
                            </div>
                        )}

                        {/* Mobile Cards */}
                        {!loading && !error && contacts?.length > 0 && (
                            <div className="mobile-cards">
                                {contacts.map((enquiry, index) => (
                                    <div key={enquiry.id || index} className="enquiry-card">
                                        <div className="card-header">
                                            <span className="qid-badge">{enquiry.id || index + 1}</span>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-preview">{enquiry.name}</p>
                                            <div className="card-details">
                                                <div className="detail-row">
                                                    <strong>Email:</strong> {enquiry.email}
                                                </div>
                                                <div className="detail-row">
                                                    <strong>Phone:</strong> {enquiry.phone}
                                                </div>
                                                <div className="detail-row">
                                                    <strong>Course:</strong> {enquiry.subject}
                                                </div>
                                                <div className="detail-row">
                                                    <strong>Message:</strong> {enquiry.message}
                                                </div>
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
