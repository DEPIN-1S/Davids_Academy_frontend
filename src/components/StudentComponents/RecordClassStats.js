import React from 'react';
import { Typography, Paper, Button } from '@mui/material';
import '../../styles/DashboardStyles/RecordClassStats.css'; 

const RecordClassStats = () => {
  return (
    <div className="statistics-container">
            <h1>Statistics</h1>
            <p>Learn Anytime, Anywhere with David Academy</p>
            <div className="search-bar">
                <input type="text" placeholder="Search" className="search-input" />
                <select className="filter-button"><option>Course</option></select>
                <select className="filter-button"><option>Subject</option></select>
                 <select className="filter-button"><option>Duration</option></select>
            </div>
        </div>
  );
};

export default RecordClassStats;
