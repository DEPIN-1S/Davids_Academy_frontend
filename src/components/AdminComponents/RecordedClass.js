import React, { useEffect, useState } from "react";
import { FaPlay, FaPlus, FaUser, FaClock } from "react-icons/fa";
import "../../styles/AdminStyles/CourseManagement.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordedClasses } from "../../features/recorded classes/recordedClassSlice";
import { deleteRecordedClass } from "../../features/recorded classes/recordedClassSlice";

const CourseManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const { list: recordings, loading, error, page, totalPages, limit } = useSelector(
        (state) => state.recordings
    );
    const isLiveVideo = (url) => url.includes("/live/");
    const { list } = useSelector((state) => state.recordings);
    const [selectedVideo, setSelectedVideo] = useState(null);


    const handleDelete = (id) => {
        console.log("list :::", list);
        console.log("Recording Id :::", id);
        const token = localStorage.getItem("accessToken");
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


    const formatYoutubeUrl = (url) => {
        if (!url) return "";

        // Live video → cannot embed, open in new tab
        if (url.includes("/live/")) return url;

        // Shortened URL: https://youtu.be/VIDEO_ID
        if (url.includes("youtu.be")) {
            const videoId = url.split("/").pop().split("?")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // Normal YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
        if (url.includes("watch?v=")) {
            return url.replace("watch?v=", "embed/").split("&")[0]; // remove extra params
        }

        // Already embed URL
        if (url.includes("embed")) return url;

        return url;
    };



    useEffect(() => {
        console.log("Recordings Fetched ::::",recordings);
        
        const token = localStorage.getItem("accessToken");
        if (token) {
            dispatch(fetchRecordedClasses({ token, page: 1, limit: 10 }));
        }
    }, [dispatch]);

    const handlePageChange = (newPage) => {
        const token = localStorage.getItem("accessToken");
        dispatch(fetchRecordedClasses({ token, page: newPage, limit }));
    };


    const handlePlay = (videoUrl) => {
        if (isLiveVideo(videoUrl)) {
            window.open(videoUrl, "_blank");
        } else {
            const embedUrl = formatYoutubeUrl(videoUrl);
            setSelectedVideo(embedUrl);
        }
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
            <div className="recorded-class-header" >
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

                                <div
                                    className="play-overlay"
                                    onClick={() => handlePlay(cls.r_video_url)}
                                >
                                    <div className="play-button">
                                        <FaPlay />
                                    </div>
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
            <div className="pagination-controls">
                <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Prev
                </button>

                <span> Page {page} of {totalPages} </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>
            {selectedVideo && (
                <div className="video-modal">
                    <div className="video-modal-content">
                        <button
                            className="video-modal-close"
                            onClick={() => setSelectedVideo(null)}
                        >
                            ✕
                        </button>
                        <iframe
                            width="100%"
                            height="450"
                            src={selectedVideo}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube Video"
                        ></iframe>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CourseManagement;
