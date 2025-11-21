import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentTests } from "../../features/exam/examAPI";
import "../../styles/TestComponent.css";

const TestComponent = () => {
  const [testData, setTestData] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchTestData = async () => {
    setLoading(true);
    setError(null);

    try {
      const rawData = await fetchStudentTests("all");

      const uniqueTests = {};
      rawData.forEach((item) => {
        const testId = item.id;
        if (!uniqueTests[testId]) uniqueTests[testId] = item;
        else {
          const existing = uniqueTests[testId];
          if (
            item.is_submitted === 1 ||
            (item.st_score > existing.st_score && existing.is_submitted !== 1)
          ) {
            uniqueTests[testId] = item;
          }
        }
      });

      const transformedData = Object.values(uniqueTests).map((item) => {
        const fromDate = item.fromDate ? new Date(item.fromDate) : null;
        const toDate = item.toDate ? new Date(item.toDate) : null;
        const currentDate = new Date();

        // Normalize null/undefined values
        const submittedQuestions = item.submittedQuestions ?? 0;
        const correctAnswers = item.correctAnswers ?? 0;
        const wrongAnswers = item.wrongAnswers ?? 0;
        const totalQuestions = item.totalQuestions ?? 0;

        let status = "Pending";
        if (
          item.is_submitted === 1 ||
          item.status === "completed" ||
          item.isCompleted === 1
        ) {
          status = "Completed";
        } else if (toDate && toDate < currentDate) {
          status = "Expired";
        }

        return {
          id: item.id,
          name: item.testTitle || "Untitled Test",
          startDateObj: fromDate,
          endDateObj: toDate,
          totalQuestions,
          attemptedQuestions: submittedQuestions,
          correctAnswers,
          wrongAnswers,
          status,
        };
      });

      setTestData(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch test data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const getFinalStatus = (start, end, attempted, total) => {
    const today = new Date();

    let dateStatus = "Active";
    if (end && end < today) dateStatus = "Expired";
    else if (start && start > today) dateStatus = "Upcoming";

    let attemptStatus = "";
    if (attempted === 0) attemptStatus = "Not Started";
    else if (attempted > 0 && attempted < total) attemptStatus = "In Progress";
    else if (attempted === total) attemptStatus = "Completed";

    if (dateStatus === "Expired") return "Expired";
    if (dateStatus === "Upcoming" && attemptStatus === "Not Started")
      return "Upcoming";
    return attemptStatus;
  };

  // FILTER based on finalStatus
  const filteredTests = testData.filter((test) => {
    const finalStatus = getFinalStatus(
      test.startDateObj,
      test.endDateObj,
      test.attemptedQuestions,
      test.totalQuestions
    );

    if (selectedType === "All") return true;
    if (selectedType === "Completed") return finalStatus === "Completed";
    if (selectedType === "Pending")
      return finalStatus === "Not Started" || finalStatus === "In Progress";
    if (selectedType === "Expired") return finalStatus === "Expired";
    return true;
  });

  // SORT latest first
  const sortedTests = [...filteredTests].sort((a, b) => {
    const dateA = a.startDateObj ? a.startDateObj.getTime() : 0;
    const dateB = b.startDateObj ? b.startDateObj.getTime() : 0;
    return dateB - dateA;
  });

  // PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTests = sortedTests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedTests.length / itemsPerPage);

  const handleActionClick = (testId, buttonText) => {
    if (buttonText === "Start Test" || buttonText === "Resume Test") {
      navigate(`/student/exam?testId=${testId}`);
    }
  };

  if (loading) return <div className="loading">Loading tests...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="wrapper">
      <div className="header">
        <h2 className="title">Previous Tests</h2>

        <select
          className="dropdown"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Expired">Expired</option>
        </select>

        <div className="test-count">{filteredTests.length} Tests</div>
      </div>

      {/* TABLE VIEW */}
      <div className="table-responsive table-view">
        <div className="test-header">
          <span>Start Date</span>
          <span>End Date</span>
          <span>Test ID</span>
          <span>Test Title</span>
          <span>Total Questions</span>
          <span>Attempted</span>
          <span>Correct</span>
          <span>Wrong</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {currentTests.length === 0 ? (
          <div className="no-tests">No tests available.</div>
        ) : (
          currentTests.map((test) => {
            const finalStatus = getFinalStatus(
              test.startDateObj,
              test.endDateObj,
              test.attemptedQuestions,
              test.totalQuestions
            );

            let actionLabel = "";
            if (finalStatus === "Expired") actionLabel = "Expired";
            else if (finalStatus === "Completed") actionLabel = "Completed";
            else if (finalStatus === "Upcoming" || test.attemptedQuestions === 0)
              actionLabel = "Start Test";
            else if (
              test.attemptedQuestions > 0 &&
              test.attemptedQuestions < test.totalQuestions
            )
              actionLabel = "Resume Test";

            const actionDisabled =
              finalStatus === "Expired" || finalStatus === "Completed";

            return (
              <div className="test-row" key={test.id}>
                <span>
                  {test.startDateObj
                    ? test.startDateObj.toLocaleDateString()
                    : "N/A"}
                </span>
                <span>
                  {test.endDateObj
                    ? test.endDateObj.toLocaleDateString()
                    : "N/A"}
                </span>
                <span>{test.id}</span>
                <span>{test.name}</span>
                <span>{test.totalQuestions}</span>
                <span>{test.attemptedQuestions}</span>
                <span>{test.correctAnswers}</span>
                <span>{test.wrongAnswers}</span>

                <span className={`status ${finalStatus.toLowerCase().replace(" ", "-")}`}>
                  {finalStatus}
                </span>

                <span>
                  <button
                    className={`start-btn ${actionDisabled ? "disabled" : ""}`}
                    disabled={actionDisabled}
                    onClick={() => handleActionClick(test.id, actionLabel)}
                  >
                    {actionLabel}
                  </button>
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* CARD VIEW */}
      <div className="card-view">
        {currentTests.map((test) => {
          const finalStatus = getFinalStatus(
            test.startDateObj,
            test.endDateObj,
            test.attemptedQuestions,
            test.totalQuestions
          );

          let actionLabel = "";
          if (finalStatus === "Expired") actionLabel = "Expired";
          else if (finalStatus === "Completed") actionLabel = "Completed";
          else if (finalStatus === "Upcoming" || test.attemptedQuestions === 0)
            actionLabel = "Start Test";
          else if (
            test.attemptedQuestions > 0 &&
            test.attemptedQuestions < test.totalQuestions
          )
            actionLabel = "Resume Test";

          const actionDisabled =
            finalStatus === "Expired" || finalStatus === "Completed";

          return (
            <div className="test-card" key={test.id}>
              <header className="test-card__header">
                <h3 className="test-card__title">{test.name}</h3>
              </header>

              <div className="test-card__body">
                <div className="test-card__details">
                  <div className="test-card__row">
                    <span className="test-card__label">Start Date</span>
                    <span className="test-card__value">
                      {test.startDateObj ? test.startDateObj.toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="test-card__row">
                    <span className="test-card__label">End Date</span>
                    <span className="test-card__value">
                      {test.endDateObj ? test.endDateObj.toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="test-card__row">
                    <span className="test-card__label">Total Questions</span>
                    <span className="test-card__value">{test.totalQuestions}</span>
                  </div>
                  <div className="test-card__row">
                    <span className="test-card__label">Correct</span>
                    <span className="test-card__value text-success">{test.correctAnswers}</span>
                  </div>
                  <div className="test-card__row">
                    <span className="test-card__label">Wrong</span>
                    <span className="test-card__value text-danger">{test.wrongAnswers}</span>
                  </div>
                </div>

                <div className="test-card__status">
                  <span className={`status-badge status-badge--${finalStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                    {finalStatus}
                  </span>
                </div>
              </div>

              <footer className="test-card__footer">
                <button
                  className={`btn btn--primary ${actionDisabled ? "btn--disabled" : ""}`}
                  disabled={actionDisabled}
                  onClick={() => handleActionClick(test.id, actionLabel)}
                >
                  {actionLabel}
                </button>
              </footer>
            </div>

          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span className="page-info">
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestComponent;
