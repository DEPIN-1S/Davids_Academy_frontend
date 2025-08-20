import React, { useEffect } from "react";
import { FaPlay, FaPlus, FaUser, FaClock } from "react-icons/fa";
import "../../styles/AdminStyles/CourseManagement.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordedClasses } from "../../features/recorded classes/recordedClassSlice";

const CourseManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    /* const { recordings, loading, error } = useSelector(
        (state) => state.recordings
    ); */

    const { list: recordings, loading, error } = useSelector(
        (state) => state.recordings
    );


    useEffect(() => {
        console.log("recordings:::", recordings);
       

        const token = localStorage.getItem("accessToken");

        if (token) {
            dispatch(fetchRecordedClasses(token));
        }
    }, [dispatch]);

    const handlePlay = (classId) => {
        console.log("Play class:", classId);
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
                        <div key={cls.r_id} className="class-card">
                            <div className="card-thumbnail">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}${cls.r_thumbnail}`}
                                    alt={cls.r_title}
                                />
                                  
                                <div
                                    className="play-overlay"
                                    onClick={() => handlePlay(cls.r_id)}
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
