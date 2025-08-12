import React, { useEffect } from "react";
import { FaPlay, FaPlus, FaUser, FaClock } from "react-icons/fa";
import "../../styles/AdminStyles/CourseManagement.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordedClasses } from "../../features/recorded classes/recordedClassSlice";

const CourseManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recordings, loading, error } = useSelector(
        (state) => state.recordings
    );
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            dispatch(fetchRecordedClasses(token));
        }
    }, [dispatch]);

    const handlePlay = (classId) => {
        console.log("Play class:", classId);
    };

    const handleAddToPlaylist = (classId) => {
        console.log("Add to playlist:", classId);
    };

    const handleAddClick = () => {
        navigate("/admin/upload-thumbnail");
    };

    if (loading) {
        return <p>Loading recordings...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>Error: {error}</p>;
    }

    return (
        <div className="recorded-classes-container">
            <div className="classes-header">
                <button className="add-questions-btn" onClick={handleAddClick}>
                    <FaPlus /> Add Questions
                </button>
            </div>

            <div className="classes-grid">
                {Array.isArray(recordings) && recordings.length > 0 ? (
                    recordings.map((cls) => (
                        <div key={cls.id} className="class-card">
                            <div className="card-thumbnail">
                                <img src={cls.thumbnail} alt={cls.title} />
                                {cls.isNew && <div className="new-badge">New</div>}
                                <div
                                    className="play-overlay"
                                    onClick={() => handlePlay(cls.id)}
                                >
                                    <div className="play-button">
                                        <FaPlay />
                                    </div>
                                </div>
                                <button
                                    className={`playlist-btn ${cls.isInPlaylist ? "added" : ""
                                        }`}
                                    onClick={() => handleAddToPlaylist(cls.id)}
                                >
                                    <FaPlus />{" "}
                                    {cls.isInPlaylist ? "Added to playlist" : "Add to playlist"}
                                </button>
                            </div>

                            <div className="card-content">
                                <h3 className="class-title">{cls.title}</h3>
                                <div className="class-meta">
                                    <div className="meta-item">
                                        <FaClock className="meta-icon" />
                                        <span>Duration: {cls.duration}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaUser className="meta-icon" />
                                        <span>{cls.instructor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No recorded classes found.</p>
                )}
            </div>
        </div>
    );
};

export default CourseManagement;
