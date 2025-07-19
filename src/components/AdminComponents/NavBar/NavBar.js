import React from "react";
import "../../../styles/AdminStyles/NavBar.css";
import UserDropdownComponent from "../../StudentComponents/UserDropdownComponent"; // ✅ Path is correct if user dropdown is shared

const NavBar = () => {
  return (
    <div className="welcome-header d-flex justify-content-between align-items-center p-3">
      <div>
        <h4 className="fw-bold mb-1">
          Welcome Back, Admin <span className="wave">👋</span>
        </h4>
        <p className="text-muted mb-0">
          Here’s a quick snapshot of what’s happening across your academy.
        </p>
      </div>

      {/* ✅ Ensure dropdown has enough space and z-index */}
      <div className="dropdown-container">
        <UserDropdownComponent />
      </div>
    </div>
  );
};

export default NavBar;
