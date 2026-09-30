import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AdminStyles/ViewProgress.css";
import { fetchStudentProgress } from "../features/students/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetMockTest, resetQbank } from "../features/exam/examSlice";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const getPerformance = (accuracy) => {
  const val = Number(accuracy);
  if (val >= 85) {
    return { text: "Excellent", tone: "excellent", color: "#34d399" };
  }
  if (val >= 60) {
    return { text: "Good", tone: "good", color: "#f0c94a" };
  }
  return { text: "Needs Improvement", tone: "warn", color: "#fb7185" };
};

const AccuracyChart = ({ attended, correct, color }) => {
  const remaining = Math.max((attended || 0) - (correct || 0), 0);
  const data = {
    labels: ["Correct", "Remaining"],
    datasets: [
      {
        data: attended > 0 ? [correct, remaining || 0.0001] : [0, 1],
        backgroundColor: [color, "rgba(157, 176, 208, 0.16)"],
        borderWidth: 0,
        cutout: "74%",
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "74%",
        plugins: { legend: { display: false }, tooltip: { enabled: attended > 0 } },
      }}
    />
  );
};

function ViewProgress() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tests, error } = useSelector((state) => state.students);
  const [selectedTab, setSelectedTab] = useState("analysis");

  useEffect(() => {
    if (studentId) dispatch(fetchStudentProgress(studentId));
  }, [dispatch, studentId]);

  const mockTests = tests?.mockTest || [];
  const qBank = tests?.qBank || [];

  const handleQbankReset = async (id, topicId = null) => {
    const resultAction = await dispatch(
      resetQbank({ student_id: id, topic_id: topicId })
    );
    if (resetQbank.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload?.message || "Q-Bank reset successful!");
      if (id) dispatch(fetchStudentProgress(id));
    } else {
      toast.error(resultAction.payload || "Failed to reset Q-Bank");
    }
  };

  const handleMockTestReset = async (id, testId) => {
    const resultAction = await dispatch(
      resetMockTest({ student_id: id, test_id: testId })
    );
    if (resetMockTest.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload?.message || "Mock Test reset successful!");
      if (id) dispatch(fetchStudentProgress(id));
    } else {
      toast.error(resultAction.payload || "Failed to reset Mock Test");
    }
  };

  const renderCard = (title, attended, correct, key) => {
    const accuracy = attended > 0 ? ((correct / attended) * 100).toFixed(1) : 0;
    const perf = getPerformance(accuracy);
    return (
      <article className={`progress-card tone-${perf.tone}`} key={key}>
        <h4>{title}</h4>
        <div className="progress-card-metrics">
          <div className="metric">
            <strong>{attended}</strong>
            <span>Attempted</span>
          </div>
          <div className="ring-wrap">
            <AccuracyChart attended={attended} correct={correct} color={perf.color} />
            <span className="ring-value">{accuracy}%</span>
          </div>
          <div className="metric metric-correct">
            <strong>{correct}</strong>
            <span>Correct</span>
          </div>
        </div>
        <span className={`perf-chip ${perf.tone}`}>{perf.text}</span>
      </article>
    );
  };

  return (
    <div className="progress-futuristic">
      <div className="progress-tabs">
        {[
          { id: "analysis", label: "Analysis" },
          { id: "mockTest", label: "Mock Test" },
          { id: "qBank", label: "Question Bank" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`progress-tab ${selectedTab === tab.id ? "active" : ""}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {selectedTab === "mockTest" && (
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>From</th>
                <th>To</th>
                <th>Total Questions</th>
                <th>Attended</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTests.length > 0 ? (
                mockTests.map((test) => (
                  <tr key={test.test_id}>
                    <td>{test.testTitle}</td>
                    <td>{new Date(test.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(test.toDate).toLocaleDateString()}</td>
                    <td>{test.totalQuestions}</td>
                    <td>{test.total_attempted}</td>
                    <td>{test.correct_count}</td>
                    <td>{test.wrong_count}</td>
                    <td>
                      <button
                        onClick={() => handleMockTestReset(studentId, test.test_id)}
                        className="action-btn"
                      >
                        Reset Mock Test
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    No mock test progress available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedTab === "qBank" && (
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Total Questions</th>
                <th>Attended</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {qBank.length > 0 ? (
                qBank.map((topic, index) => (
                  <tr key={index}>
                    <td>{topic.topic_name}</td>
                    <td>{topic.totalQuestions}</td>
                    <td>{topic.total_attempted}</td>
                    <td>{topic.correct_count}</td>
                    <td>{topic.wrong_count}</td>
                    <td>
                      {topic.total_attempted > 0 ? (
                        <button
                          onClick={() => handleQbankReset(studentId, topic.topic_id)}
                          className="action-btn"
                        >
                          Reset Topic
                        </button>
                      ) : (
                        <span className="empty-note">No attempts yet</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No Q-Bank progress available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedTab === "analysis" && (
        <div className="analysis-wrap">
          <h2 className="analysis-title">Student Progress Analysis</h2>

          <section className="analysis-section">
            <h3>Mock Test Performance</h3>
            {mockTests.length > 0 ? (
              <div className="progress-grid">
                {mockTests.map((test, idx) =>
                  renderCard(
                    test.testTitle || `Mock Test ${idx + 1}`,
                    test.total_attempted || 0,
                    test.correct_count || 0,
                    `mock-${test.test_id || idx}`
                  )
                )}
              </div>
            ) : (
              <p className="empty-note">No Mock Tests attended yet.</p>
            )}
          </section>

          <section className="analysis-section">
            <h3>Question Bank Topic Performance</h3>
            {qBank.length > 0 ? (
              <div className="progress-grid">
                {qBank.map((topic, idx) =>
                  renderCard(
                    topic.topic_name || `Topic ${idx + 1}`,
                    topic.total_attempted || 0,
                    topic.correct_count || 0,
                    `topic-${topic.topic_id || idx}`
                  )
                )}
              </div>
            ) : (
              <p className="empty-note">No Question Bank topics attended yet.</p>
            )}
          </section>
        </div>
      )}

      {error && <p className="progress-error">{error}</p>}

      <div className="progress-back">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          Back To Student Management
        </button>
      </div>
    </div>
  );
}

export default ViewProgress;
