import React from 'react';
import '../../styles/DashboardStyles/NewVideoComponent.css'; 

const PlaylistComponent = () => {
    const videos = [
        {
            title: "Introduction to Prometric Pharmacology",
            duration: "45 min",
            instructor: "Dr. Sarah Mathews",
            new: true,
        },
        {
            title: "Introduction to Prometric Pharmacology",
            duration: "45 min",
            instructor: "Dr. Sarah Mathews",
            new: true,
        },
        {
            title: "Introduction to Prometric Pharmacology",
            duration: "45 min",
            instructor: "Dr. Sarah Mathews",
            new: true,
        },
    ];

    return (
        <div className="video-container">
            <h2>Playlist</h2>
            <div className="video-grid">
                {videos.map((video, index) => (
                    <div className="video-card" key={index}>
                        {video.new && <span className="new-badge">New</span>}
                        <div className="video-thumbnail">
                            <button className="play-button">▶</button>
                        </div>
                        <h3>{video.title}</h3>
                        <p>Duration: {video.duration}</p>
                        <p>By: {video.instructor}</p>
                        <button className="add-to-playlist">+ Add to playlist</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistComponent;
