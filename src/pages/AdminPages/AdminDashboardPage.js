import React, { useEffect } from "react";
import "../../styles/AdminStyles/AdminDashboardPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../features/courses/courseSlice";
import { fetchRecentEnquiries } from "../../features/contact/contactSlice";
import { fetchStudents } from "../../features/students/studentSlice";
import { Link } from "react-router-dom";
import { adminFetchTestQuestions } from "../../features/exam/examSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();

  // Courses
  const { list: courses, loading: coursesLoading } = useSelector((state) => state.course);

  // Students
  const { total: studentCount } = useSelector((state) => state.students);

  // Recent enquiries
  const { recentEnquiries } = useSelector((state) => state.contact);

  // Test questions count
  const { adminTestQuestionsTotalCount } = useSelector((state) => state.exam);

  // Fetch all data
  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchStudents()); // total is already in slice
    dispatch(fetchRecentEnquiries());
    dispatch(adminFetchTestQuestions()); // total count in slice
  }, [dispatch]);

  // Stats for dashboard
  const stats = [
    {
      title: "Total Students",
      value: studentCount || 0,
      change: "20%",
      subtitle: "Increase of 65 Student",
    },
    {
      title: "Total Courses",
      value: coursesLoading ? "Loading..." : courses.length,
      subtitle: "Available for student",
    },
    {
      title: "Tests Created",
      value: adminTestQuestionsTotalCount || 0,
      change: "12%",
      subtitle: "increase in 30 days",
    },
  ];

  // Dummy top batches and subjects
  const topBatches = [
    { name: "DHA", avg: 83, color: "#00BFFF" },
    { name: "NCLEX", avg: 79, color: "#8A2BE2" },
    { name: "HAAD", avg: 76, color: "#32CD32" },
  ];

  const topSubjects = [
    { name: "Pharmacology", avg: 83, color: "#00BFFF" },
    { name: "Pediatric Emergencies", avg: 79, color: "#8A2BE2" },
    { name: "HAAD", avg: 76, color: "#32CD32" },
  ];

  return (
    <div className="dashboard-container">
      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className="stats-header">
              <h3>{stat.title}</h3>
              <span className="arrow-icon">↗</span>
            </div>
            <h2>{stat.value.toLocaleString()}</h2>
            {stat.change && <span className="change-badge">{stat.change} ↑</span>}
            <p className="stats-subtitle">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Performance and Enquiries */}
      <div className="content-grid">
        {/* Performance */}
        <div className="performance-card">
          <h2>Student Performance Overview</h2>

          <h4>Top Performing Batches This Month</h4>
          {topBatches.map((batch, i) => (
            <div key={i} className="progress-item">
              <span>{batch.name}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${batch.avg}%`, backgroundColor: batch.color }}
                />
              </div>
              <span className="avg-text">Avg {batch.avg}%</span>
            </div>
          ))}

          <h4 style={{ marginTop: "20px" }}>Top Performing Subjects This Month</h4>
          {topSubjects.map((subj, i) => (
            <div key={i} className="progress-item">
              <span>{subj.name}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${subj.avg}%`, backgroundColor: subj.color }}
                />
              </div>
              <span className="avg-text">Avg {subj.avg}%</span>
            </div>
          ))}
        </div>

        {/* Recent Enquiries */}
        <div className="enquiries-card">
          <div className="enquiries-header">
            <h2>Recent Enquiries</h2>
            <Link to="/admin/enquire-lead">
              <button className="view-all-btn">View all</button>
            </Link>
          </div>

          <div className="enquiry-list">
            {recentEnquiries?.length > 0 ? (
              recentEnquiries.slice(0, 4).map(({ _id, cu_course_interested, cu_name, cu_status }) => (
                <div className="enquiry-item" key={_id}>
                  <div>
                    <h4>{cu_name}</h4>
                    <span className="enquiry-course">{cu_course_interested}</span>
                  </div>
                  <span className="status-badge">{cu_status}</span>
                </div>
              ))
            ) : (
              <p>No enquiries found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
