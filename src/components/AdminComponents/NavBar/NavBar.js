import React from "react";
import { FaBars, FaCompress, FaExpand } from "react-icons/fa";
import {
  FaThLarge,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaVideo,
  FaPhone,
  FaPlus,
  FaEdit,
  FaQuestionCircle,
  FaLightbulb
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../../../styles/AdminStyles/NavBar.css";
import UserDropdownComponent from "../../StudentComponents/UserDropdownComponent";

const NavBar = ({ onToggleSidebar, onToggleCollapse, isCollapsed }) => {
  const location = useLocation();

  // Define route-specific headings, subtitles, and icons
  const routeConfig = {
    "/admin/dashboard": {
      title: "Welcome Back, Admin",
      subtitle: "Here's a quick snapshot of what's happening across your academy.",
      icon: <FaThLarge />,
      showWave: true
    },
    "/admin/student-manage": {
      title: "Student Management",
      subtitle: "View, add, assign, and track student progress across all active courses.",
      icon: <FaUserGraduate />
    },
    "/admin/course-management": {
      title: "Course Management",
      subtitle: "Manage courses and their details",
      icon: <FaBook />
    },
    "/admin/question-management": {
      title: "Test & Q-bank Management",
      subtitle: "Manage practice questions, and schedule weekly mock tests for all students.",
      icon: <FaClipboardList />
    },
    "/admin/recorded-class": {
      title: "Recorded Classes",
      subtitle: "Upload, organize, and manage your recorded class sessions.",
      icon: <FaVideo />
    },
    "/admin/enquire-lead": {
      title: "Enquiries & Leads",
      subtitle: "View and manage all incoming student enquiries, course interests, and admission leads in one place.",
      icon: <FaPhone />
    }
  };

  // Get current route config with enhanced path matching
  const getPageConfig = () => {
    const path = location.pathname;

    // Handle question creation flow
    if (path.includes('/admin/question-type')) {
      return {
        title: "Create Question",
        subtitle: "Select question type and build assessments for your courses.",
        icon: <FaQuestionCircle />
      };
    }

    if (path.includes('/admin/answer-explain')) {
      return {
        title: "Question Explanation",
        subtitle: "Add detailed explanations and additional information for your question.",
        icon: <FaLightbulb />
      };
    }

    // Handle student management sub-pages
    if (path.includes('/admin/add-student')) {
      return {
        title: "Add New Student",
        subtitle: "Register a new student and assign them to courses.",
        icon: <FaPlus />
      };
    }

    if (path.includes('/admin/edit-student')) {
      return {
        title: "Edit Student",
        subtitle: "Update student information and course assignments.",
        icon: <FaEdit />
      };
    }

    // Handle course management sub-pages
    if (path.includes('/admin/add-course')) {
      return {
        title: "Add New Course",
        subtitle: "Create a comprehensive course for your students.",
        icon: <FaPlus />
      };
    }

    if (path.includes('/admin/edit-course')) {
      return {
        title: "Edit Course",
        subtitle: "Update course content and settings.",
        icon: <FaEdit />
      };
    }

    // Return the matched config or default
    return routeConfig[path] || {
      title: "Admin Panel",
      subtitle: "Manage your academy's operations and resources.",
      icon: <FaThLarge />
    };
  };

  const pageConfig = getPageConfig();

  return (
    <nav className="admin-navbar">
      <div className="navbar-content">
        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle mobile sidebar"
        >
          <FaBars />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          className="desktop-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FaExpand /> : <FaCompress />}
        </button>

        {/* Dynamic Welcome Text with Icon */}
        <div className="welcome-text">
          <h4 className="welcome-title">
            {pageConfig.icon && (
              <span className="page-icon" style={{ marginRight: '8px' }}>
                {pageConfig.icon}
              </span>
            )}
            {pageConfig.title}
            {pageConfig.showWave && (
              <span className="wave">👋</span>
            )}
          </h4>
          <p className="welcome-subtitle">
            {pageConfig.subtitle}
          </p>
        </div>

        <div className="navbar-actions">
          <UserDropdownComponent />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
