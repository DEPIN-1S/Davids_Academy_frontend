import React from 'react';
import '../styles/SampleQuestionnaire.css'

const SampleQuestionnaire = () => {
  return (
    <section className="questionnaire-section">
      <div className="questionnaire-container">
        <h2 className="questionnaire-title">Try Our Sample Questionnaire</h2>
        <p className="questionnaire-description">
          Practice with real-world sample questions covering nursing entrance exams, international certifications,
          and competitive tests. See how our training helps you answer them with confidence.
        </p>
        <button className="questionnaire-button">Explore Sample Questions →</button>
      </div>
    </section>
  );
};

export default SampleQuestionnaire;
