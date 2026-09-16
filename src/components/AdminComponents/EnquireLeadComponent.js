import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/AdminStyles/EnquireLeadComponent.css";
import { fetchRecentEnquiries } from "../../features/contact/contactSlice";

const EnquireLeadComponent = () => {
    const { recentEnquiries, loading, error } = useSelector((state) => state.contact);
    const dispatch = useDispatch();
    console.log("Enquiries::::", recentEnquiries);

    useEffect(() => {
        dispatch(fetchRecentEnquiries());
    }, [dispatch]);

    return (
        <div className="enquire-lead-page enquire-lead-futuristic">
            <div className="content-area">
                
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
                        {!loading && !error && (recentEnquiries || []).length > 0 && (
                            <div className="desktop-table">
                                <table className="enquiries-table">
                                    <thead>
                                        <tr>
                                            <th>Q-ID</th>
                                            <th>Name</th>
                                            <th>Email / Phone</th>
                                            <th>Course Interested</th>
                                            <th>Message</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(recentEnquiries || []).map((enquiry, index) => (
                                            <tr
                                                key={enquiry.cu_id || index}
                                                className={index % 2 === 1 ? "row-even" : "row-odd"}
                                                style={{ animationDelay: `${index * 0.03}s` }}
                                            >
                                                <td className="cell-qid">{enquiry?.cu_id || index + 1}</td>
                                                <td className="cell-preview">{enquiry?.cu_name}</td>
                                                <td className="cell-contact">
                                                    {enquiry.cu_email} <br />{enquiry?.cu_mobile}
                                                </td>
                                                <td className="cell-course">{enquiry?.cs_name}</td>
                                                <td className="cell-message">{enquiry?.cu_message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {/* Empty state */}
                        {!loading && !error && (recentEnquiries || []).length === 0 && (
                            <div style={{ textAlign: "center", color: "#888", padding: "3rem" }}>
                                No enquiries found.
                            </div>
                        )}

                        {/* Mobile Cards */}
                        {!loading && !error && (recentEnquiries || []).length > 0 && (
                            <div className="mobile-cards">
                                {recentEnquiries.map((enquiry, index) => (
                                    <div
                                        key={enquiry.cu_id || index}
                                        className="enquiry-card"
                                        style={{ animationDelay: `${index * 0.04}s` }}
                                    >
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
