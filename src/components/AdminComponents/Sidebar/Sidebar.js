import React from "react";
import {
  FaThLarge,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaVideo,
  FaPhone,
  FaSignOutAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/AdminStyles/Sidebar.css";

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar, toggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaThLarge />, path: "/admin/dashboard" },
    { name: "Student Management", icon: <FaUserGraduate />, path: "/admin/student-manage" },
    { name: "Course Management", icon: <FaBook />, path: "/admin/course-management" },
    {
      name: "Test & Q-bank Management",
      icon: <FaClipboardList />,
      path: "/admin/question-management",
    },
    { name: "Recorded Classes", icon: <FaVideo />, path: "/admin/course-management" },
    { name: "Enquiries & Leads", icon: <FaPhone />, path: "/admin/enquire-lead" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 767) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    if (window.innerWidth <= 767) {
      toggleSidebar();
    }
    navigate("/");
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "mobile-open" : ""} ${isCollapsed ? "collapsed" : ""}`}
      role="complementary"
      aria-label="Main navigation sidebar"
    >
      {/* Sidebar Header */}
      <header className="sidebar-header">
        <div className="sidebar-brand">
          <img src="/images/logo.png" alt="David's Academy Logo" className="sidebar-logo" />
          <h1 className="sidebar-title">David's Academy</h1>
        </div>

        {/* Mobile Close Button */}
        <button
          className="sidebar-close-btn mobile-only"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          type="button"
        >
          <FaTimes />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          className="sidebar-collapse-btn desktop-only"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </header>

      {/* Navigation Menu */}
      <nav className="sidebar-menu" role="navigation" aria-label="Main navigation">
        <ul className="sidebar-menu-list">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-menu-item">
              <button
                onClick={() => handleNavigation(item.path)}
                onKeyDown={(e) => handleKeyDown(e, () => handleNavigation(item.path))}
                className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                title={isCollapsed ? item.name : ""}
                type="button"
                aria-current={location.pathname === item.path ? "page" : undefined}
              >
                <span className="sidebar-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="sidebar-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <footer className="sidebar-logout">
        <button
          onClick={handleLogout}
          onKeyDown={(e) => handleKeyDown(e, handleLogout)}
          className="logout-btn"
          title={isCollapsed ? "Logout" : ""}
          type="button"
          aria-label="Logout from admin panel"
        >
          <FaSignOutAlt className="logout-icon" aria-hidden="true" />
          <span className="logout-text">Logout</span>
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;
