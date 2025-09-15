import React, { useEffect, useState } from "react";
import { FaPlay, FaPlus, FaUser, FaClock } from "react-icons/fa";
import "../../styles/AdminStyles/CourseManagement.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordedClasses, deleteRecordedClass } from "../../features/recorded classes/recordedClassSlice";

const CourseManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const { list: recordings, loading, error, page, totalPages, limit } = useSelector(
        (state) => state.recordings
    );
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleDelete = (id) => {
        const token = sessionStorage.getItem("accessToken");
        dispatch(deleteRecordedClass(id))
            .unwrap()
            .then(() => {
                alert("Recorded class deleted successfully!");
                dispatch(fetchRecordedClasses({ token, page: 1, limit: 10 }));
            })
            .catch((error) => {
                alert("Failed to delete recorded class: " + error.message);
            });
    };

    // 🔹 Convert Google Drive share link → embed link
    const formatDriveUrl = (url) => {
        if (!url || !url.includes("drive.google.com")) return url;
        const fileIdMatch = url.match(/[-\w]{25,}/); // extract file ID
        if (!fileIdMatch) return url;
        return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
    };

    const handlePlay = (videoUrl) => {
        if (!videoUrl) return;
        setSelectedVideo(formatDriveUrl(videoUrl));
    };

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            dispatch(fetchRecordedClasses({ token, page: 1, limit: 10 }));
        }
    }, [dispatch]);

    const handlePageChange = (newPage) => {
        const token = sessionStorage.getItem("accessToken");
        dispatch(fetchRecordedClasses({ token, page: newPage, limit }));
    };

    const handleAddClick = () => {
        navigate("/admin/upload-thumbnail");
    };

    if (loading) return <p>Loading recordings...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="recorded-classes-container">
            <div className="recorded-class-header">
                <div className="search-container">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="search-input"
                    />
                </div>
                <button className="add-questions-btn" onClick={handleAddClick}>
                    <FaPlus /> Add Recorded Class
                </button>
            </div>

            <div className="classes-grid">
                {Array.isArray(recordings) && recordings.length > 0 ? (
                    recordings.map((cls) => (
                        <div key={cls.r_id} className="class-card">
                            <div className="card-thumbnail">
                                <img
                                    src={`https://lunarsenterprises.com:6040/${cls.r_thumbnail}`}
                                    alt={cls.r_title}
                                />
                                <div className="play-overlay" onClick={() => handlePlay(cls.r_video_url)}>
                                    <div className="play-button"><FaPlay /></div>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="class-title">{cls.r_title}</h3>
                                <div className="class-meta">
                                    <div className="meta-item">
                                        <FaClock className="meta-icon" />
                                        <span>Duration: {cls.r_duration}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaUser className="meta-icon" />
                                        <span>{cls.r_tutor_name}</span>
                                    </div>
                                    <button onClick={() => handleDelete(cls.r_id)} className="recorded-class-delete-btn">
                                        Delete class
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No recorded classes found.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="pagination-controls">
                <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Prev</button>
                <span> Page {page} of {totalPages} </span>
                <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next</button>
            </div>

            {/* Video Popup Modal */}
            {selectedVideo && (
                <div className="video-modal">
                    <div className="video-modal-content">
                        <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>✕</button>
                        <iframe
                            width="100%"
                            height="450"
                            src={selectedVideo}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="Drive Video Player"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
