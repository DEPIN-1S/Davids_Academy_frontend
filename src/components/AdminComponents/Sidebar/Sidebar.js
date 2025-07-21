import React from "react";
import { Nav } from "react-bootstrap";
import {
  FaThLarge,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaVideo,
  FaPhone,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../../styles/AdminStyles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FaThLarge />, path: "/admin/dashboard" },
    { name: "Student Management", icon: <FaUserGraduate />, path: "/admin/student-manage" },
    { name: "Course Management", icon: <FaBook />, path: "/admin/course-management" },
    {
      name: "Test & Q-bank Management",
      icon: <FaClipboardList />, path: "/admin/question-management",
    }
    ,
    { name: "Recorded Classes", icon: <FaVideo />, path: "/admin/classes" },
    { name: "Enquiries & Leads", icon: <FaPhone />, path: "/admin/enquiries" },
  ];

  return (
    <div className="academy-sidebar">
      <div className="sidebar-header">
        <img src={"/images/logo.png"} alt="Logo" className="sidebar-logo" />
        <h4 className="sidebar-title">David’s Academy</h4>
      </div>

      <Nav className="flex-column sidebar-menu">
        {menuItems.map((item, index) => (
          <Nav.Link key={index} href={item.path} className={`sidebar-item`}>
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </Nav.Link>
        ))}
      </Nav>

      <div className="sidebar-logout">
        <Nav.Link onClick={() => navigate("/")} className="logout-btn">
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;
