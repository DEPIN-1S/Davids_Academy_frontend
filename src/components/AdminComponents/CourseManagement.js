import React, { useState } from "react";
import { FaPlay, FaPlus, FaBookmark, FaUser, FaClock } from "react-icons/fa";
import "../../styles/AdminStyles/CourseManagement.css";

const CourseManagement = () => {
    const [classes] = useState([
        {
            id: 1,
            title: "Introduction to Prometric Pharmacology",
            instructor: "Dr. Sarah Mathews",
            duration: "45 min",
            thumbnail: "/images/class-thumb-1.jpg",
            isNew: true,
            isInPlaylist: false
        },
        {
            id: 2,
            title: "Introduction to Prometric Pharmacology",
            instructor: "Dr. Sarah Mathews",
            duration: "45 min",
            thumbnail: "/images/class-thumb-2.jpg",
            isNew: true,
            isInPlaylist: true
        },
        {
            id: 3,
            title: "Introduction to Prometric Pharmacology",
            instructor: "Dr. Sarah Mathews",
            duration: "45 min",
            thumbnail: "/images/class-thumb-3.jpg",
            isNew: true,
            isInPlaylist: false
        },
        {
            id: 4,
            title: "Introduction to Prometric Pharmacology",
            instructor: "Dr. Sarah Mathews",
            duration: "45 min",
            thumbnail: "/images/class-thumb-4.jpg",
            isNew: true,
            isInPlaylist: false
        },
        {
            id: 5,
            title: "Introduction to Prometric Pharmacology",
            instructor: "Dr. Sarah Mathews",
            duration: "45 min",
            thumbnail: "/images/class-thumb-5.jpg",
            isNew: true,
            isInPlaylist: true
        },
        {
            id: 6,
            title: "Introduction to Prometric Pharmacology",
            instructor: "Dr. Sarah Mathews",
            duration: "45 min",
            thumbnail: "/images/class-thumb-6.jpg",
            isNew: true,
            isInPlaylist: false
        }
    ]);

    const handlePlay = (classId) => {
        console.log("Play class:", classId);
    };

    const handleAddToPlaylist = (classId) => {
        console.log("Add to playlist:", classId);
    };

    const handleAddQuestions = () => {
        console.log("Add questions");
    };

    return (
        <div className="recorded-classes-container">
            <div className="classes-header">
                <button className="add-questions-btn" onClick={handleAddQuestions}>
                    <FaPlus /> Add Questions
                </button>
            </div>

            <div className="classes-grid">
                {classes.map((cls) => (
                    <div key={cls.id} className="class-card">
                        <div className="card-thumbnail">
                            <img src={cls.thumbnail} alt={cls.title} />

                            {/* New Badge */}
                            {cls.isNew && (
                                <div className="new-badge">New</div>
                            )}

                            {/* Play Button Overlay */}
                            <div
                                className="play-overlay"
                                onClick={() => handlePlay(cls.id)}
                            >
                                <div className="play-button">
                                    <FaPlay />
                                </div>
                            </div>

                            {/* Add to Playlist Button */}
                            <button
                                className={`playlist-btn ${cls.isInPlaylist ? 'added' : ''}`}
                                onClick={() => handleAddToPlaylist(cls.id)}
                            >
                                <FaPlus /> {cls.isInPlaylist ? 'Added to playlist' : 'Add to playlist'}
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
                ))}
            </div>
        </div>
    );
};

export default CourseManagement;
