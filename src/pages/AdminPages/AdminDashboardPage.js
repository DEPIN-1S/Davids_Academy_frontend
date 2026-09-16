import React, { useEffect, useMemo } from "react";
import "../../styles/AdminStyles/AdminDashboardPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../features/courses/courseSlice";
import { fetchRecentEnquiries } from "../../features/contact/contactSlice";
import { fetchStudents } from "../../features/students/studentSlice";
import { Link } from "react-router-dom";
import { adminFetchTestQuestions } from "../../features/exam/examSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { FaUserGraduate, FaBook, FaClipboardList } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#c9d4ea",
        boxWidth: 10,
        font: { size: 11 },
      },
    },
  },
};

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { list: courses, loading: coursesLoading } = useSelector((state) => state.course);
  const { total: studentCount } = useSelector((state) => state.students);
  const { recentEnquiries } = useSelector((state) => state.contact);
  const { adminTestQuestionsTotalCount } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(
      fetchStudents({
        page: 1,
        limit: 1,
        searchQuery: "",
        filterStatus: "all",
      })
    );
    dispatch(fetchRecentEnquiries());
    dispatch(adminFetchTestQuestions({ page: 1, limit: 1 }));
  }, [dispatch]);

  const students = studentCount || 0;
  const courseCount = coursesLoading ? 0 : courses.length;
  const testsCreated = adminTestQuestionsTotalCount || 0;
  const enquiries = recentEnquiries || [];

  const topBatches = [
    { name: "DHA", avg: 83, color: "#38bdf8" },
    { name: "NCLEX", avg: 79, color: "#a78bfa" },
    { name: "HAAD", avg: 76, color: "#34d399" },
  ];

  const topSubjects = [
    { name: "Pharmacology", avg: 83, color: "#f0c94a" },
    { name: "Pediatric Emergencies", avg: 79, color: "#fb7185" },
    { name: "HAAD", avg: 76, color: "#22d3ee" },
  ];

  const growthSeries = useMemo(() => {
    const base = Math.max(students - 65, 40);
    return [base, base + 12, base + 18, base + 31, base + 44, base + 52, students || base + 65];
  }, [students]);

  const enquiryStatus = useMemo(() => {
    const counts = enquiries.reduce((acc, item) => {
      const key = (item.cu_status || "NEW").toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(counts);
    return {
      labels: labels.length ? labels : ["No data"],
      values: labels.length ? labels.map((label) => counts[label]) : [1],
    };
  }, [enquiries]);

  const stats = [
    {
      title: "Total Students",
      value: students,
      change: "20%",
      subtitle: "Increase of 65 students",
      icon: <FaUserGraduate />,
      accent: "cyan",
    },
    {
      title: "Total Courses",
      value: coursesLoading ? "—" : courseCount,
      subtitle: "Available for students",
      icon: <FaBook />,
      accent: "gold",
    },
    {
      title: "Tests Created",
      value: testsCreated,
      change: "12%",
      subtitle: "Increase in 30 days",
      icon: <FaClipboardList />,
      accent: "violet",
    },
  ];

  const lineData = {
    labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Students",
        data: growthSeries,
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34, 211, 238, 0.16)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#22d3ee",
      },
    ],
  };

  const barData = {
    labels: topBatches.map((item) => item.name),
    datasets: [
      {
        label: "Average %",
        data: topBatches.map((item) => item.avg),
        backgroundColor: topBatches.map((item) => item.color),
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };

  const doughnutData = {
    labels: topSubjects.map((item) => item.name),
    datasets: [
      {
        data: topSubjects.map((item) => item.avg),
        backgroundColor: topSubjects.map((item) => item.color),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const enquiryChartData = {
    labels: enquiryStatus.labels,
    datasets: [
      {
        data: enquiryStatus.values,
        backgroundColor: ["#34d399", "#38bdf8", "#f0c94a", "#fb7185", "#a78bfa"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="dashboard-container dash-futuristic">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className={`stats-card accent-${stat.accent}`}>
            <div className="stats-header">
              <h3>{stat.title}</h3>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <h2>{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}</h2>
            {stat.change && <span className="change-badge">{stat.change} ↑</span>}
            <p className="stats-subtitle">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="performance-card">
          <div className="panel-head">
            <h3>Student Growth Signal</h3>
            <span className="live-pill">Live</span>
          </div>
          <div className="chart-frame chart-frame-lg">
            <Line
              data={lineData}
              options={{
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: false } },
                scales: {
                  x: {
                    ticks: { color: "#9db0d0" },
                    grid: { color: "rgba(157, 176, 208, 0.12)" },
                  },
                  y: {
                    ticks: { color: "#9db0d0" },
                    grid: { color: "rgba(157, 176, 208, 0.12)" },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="enquiries-card">
          <div className="enquiries-header">
            <h3>Recent Enquiries</h3>
            <Link to="/admin/enquire-lead">
              <button className="view-all-btn">View all</button>
            </Link>
          </div>
          <div className="chart-frame chart-frame-sm">
            <Doughnut
              data={enquiryChartData}
              options={{
                ...chartDefaults,
                cutout: "68%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#c9d4ea", boxWidth: 8, font: { size: 10 } },
                  },
                },
              }}
            />
          </div>
          <div className="enquiry-list">
            {enquiries.length > 0 ? (
              enquiries.slice(0, 5).map(({ _id, cs_name, cu_name, cu_status }) => (
                <div className="enquiry-item" key={_id}>
                  <div>
                    <h4>{cu_name}</h4>
                    <span className="enquiry-course">{cs_name}</span>
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

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Top Performing Batches</h3>
          <div className="chart-frame">
            <Bar
              data={barData}
              options={{
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: false } },
                scales: {
                  x: {
                    ticks: { color: "#c9d4ea" },
                    grid: { display: false },
                  },
                  y: {
                    min: 60,
                    max: 100,
                    ticks: { color: "#9db0d0" },
                    grid: { color: "rgba(157, 176, 208, 0.12)" },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="chart-card">
          <h3>Top Performing Subjects</h3>
          <div className="chart-frame">
            <Doughnut
              data={doughnutData}
              options={{
                ...chartDefaults,
                cutout: "62%",
                plugins: {
                  legend: {
                    position: "right",
                    labels: { color: "#c9d4ea", boxWidth: 10, font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
