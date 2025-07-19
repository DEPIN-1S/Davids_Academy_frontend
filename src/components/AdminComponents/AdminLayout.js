import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import NavBar from "./NavBar/NavBar";
import "../../styles/AdminStyles/AdminLayout.css";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="main-layout-container">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`main-layout-content ${isOpen ? "expanded" : "collapsed"}`}
      >
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
