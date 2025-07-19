import React, { useState } from 'react';
import '../../styles/DashboardStyles/NotesComponent.css';
import EditIcon from '@mui/icons-material/Edit';

const NotesComponent = () => {
  const [activeFilter, setActiveFilter] = useState('Today');

  const filters = ['Today', 'This Week', 'This Month', 'All'];

  const notes = [
    {
      date: '12/22/2025',
      title: 'Class: DHA Pharmacology Essentials — Part 1',
      content: [
        'Important side effects of beta-blockers',
        'Shortcut for drug classification — revise',
        'Difference between metoprolol vs propranolol',
        'High-yield topic — rewatch',
        'Check in Q-bank practice',
      ],
    },
    {
      date: '12/22/2025',
      title: 'Class: DHA Pharmacology Essentials — Part 1',
      content: `Today’s class covered key beta-blocker side effects and an easy drug classification shortcut. I need to review the difference between metoprolol and propranolol later. The section at 25 minutes is high-yield for DHA, so I’ll rewatch it and check related questions in the Q-bank. Overall, helpful session to build ...`,
    },
    // Add more notes here...
  ];

  return (
    <div className="notes-wrapper">
      <h2 className="notes-heading">My Notes</h2>
      <div className="notes-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="notes-grid">
        {notes.map((note, index) => (
          <div className="note-card" key={index}>
            <span className="note-date">{note.date}</span>
            <h4 className="note-title">{note.title}</h4>
            {Array.isArray(note.content) ? (
              <ul className="note-list">
                {note.content.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="note-paragraph">{note.content}</p>
            )}
            <div className="edit-icon">
              <EditIcon sx={{ color: '#fff' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesComponent;
