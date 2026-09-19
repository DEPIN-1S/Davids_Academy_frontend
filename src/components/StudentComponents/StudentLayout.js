import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar/Navbar";
import "../../styles/AdminStyles/AdminLayout.css";
import "../../styles/DashboardStyles/StudentFuturistic.css";
const StudentLayout = () => {
    const [isOpen] = useState(false);

    useEffect(() => {
        document.body.classList.add("student-theme");
        return () => document.body.classList.remove("student-theme");
    }, []);

    return (
        <div className="main-layout-container student-futuristic">
            <div
                className={`main-layout-content ${isOpen ? "expanded" : "collapsed"}`}
            >
                <NavBar />
                <Outlet />
            </div>
        </div>
    );
};

export default StudentLayout;
