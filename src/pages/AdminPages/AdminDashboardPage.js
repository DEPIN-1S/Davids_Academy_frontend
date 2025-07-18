import React from "react";
import "../../styles/AdminStyles/AdminDashboardPage.css";

const DashboardPage = () => {
  const stats = [
    {
      title: "Total Students",
      value: 1260,
      change: "20%",
      subtitle: "Increase of 65 Student",
    },
    { title: "Total Courses", value: 6, subtitle: "Available for student" },
    {
      title: "Tests Created",
      value: 145,
      change: "12%",
      subtitle: "increase in 30 days",
    },
  ];

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

  const enquiries = [
    { name: "Aisha Khan", course: "DHA", status: "NEW" },
    { name: "Aisha Khan", course: "DHA", status: "NEW" },
    { name: "Aisha Khan", course: "DHA", status: "NEW" },
    { name: "Aisha Khan", course: "DHA", status: "NEW" },
    { name: "Aisha Khan", course: "DHA", status: "NEW" },
  ];

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className="stats-header">
              <h3>{stat.title}</h3>
              <span className="arrow-icon">↗</span>
            </div>
            <h2>{stat.value.toLocaleString()}</h2>
            {stat.change && (
              <span className="change-badge">{stat.change} ↑</span>
            )}
            <p className="stats-subtitle">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="performance-card">
          <h2>Student Performance Overview</h2>

          <h4>Top Performing Batches This Month</h4>
          {topBatches.map((batch, i) => (
            <div key={i} className="progress-item">
              <span>{batch.name}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${batch.avg}%`,
                    backgroundColor: batch.color,
                  }}
                ></div>
              </div>
              <span className="avg-text">Avg {batch.avg}%</span>
            </div>
          ))}

          <h4 style={{ marginTop: "20px" }}>
            Top Performing Subjects This Month
          </h4>
          {topSubjects.map((subj, i) => (
            <div key={i} className="progress-item">
              <span>{subj.name}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${subj.avg}%`, backgroundColor: subj.color }}
                ></div>
              </div>
              <span className="avg-text">Avg {subj.avg}%</span>
            </div>
          ))}
        </div>

        <div className="enquiries-card">
          <div className="enquiries-header">
            <h2>Recent Enquiries</h2>
            <button className="view-all-btn">View all</button>
          </div>

          {enquiries.map((enq, i) => (
            <div key={i} className="enquiry-item">
              <div>
                <h4>{enq.name}</h4>
                <span className="enquiry-course">{enq.course}</span>
              </div>
              <span className="status-badge">{enq.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
