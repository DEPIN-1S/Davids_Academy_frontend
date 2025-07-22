import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import NavBar from "./NavBar/NavBar";
import "../../styles/AdminStyles/AdminLayout.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Close mobile sidebar on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        toggleCollapse={toggleCollapse}
      />

      <div className={`admin-main-content ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        } ${isSidebarOpen ? "mobile-sidebar-open" : ""}`}>
        <header className="admin-header">
          <NavBar
            onToggleSidebar={toggleSidebar}
            onToggleCollapse={toggleCollapse}
            isCollapsed={isCollapsed}
          />
        </header>

        <main className="admin-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default AdminLayout;
