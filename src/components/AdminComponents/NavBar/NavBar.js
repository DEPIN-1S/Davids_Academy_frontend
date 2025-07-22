import React from "react";
import { FaBars, FaCompress, FaExpand } from "react-icons/fa";
import "../../../styles/AdminStyles/NavBar.css";
import UserDropdownComponent from "../../StudentComponents/UserDropdownComponent";

const NavBar = ({ onToggleSidebar, onToggleCollapse, isCollapsed }) => {
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

        <div className="welcome-text">
          <h4 className="welcome-title">
            Welcome Back, Admin <span className="wave">👋</span>
          </h4>
          <p className="welcome-subtitle">
            Here's a quick snapshot of what's happening across your academy.
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
