import React from "react";
import { FaUser } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import "../../../styles/AdminStyles/NavBar.css";

function NavBar() {
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

      <div className="profile-box d-flex align-items-center px-3 py-2">
        <FaUser className="profile-icon me-2" />
        <div className="profile-info me-2">
          <span className="fw-semibold d-block">Admin</span>
          <small className="text-muted">Adminexample@gmail.com</small>
        </div>
        <IoChevronDownOutline />
      </div>
    </div>
  );
}

export default NavBar;
