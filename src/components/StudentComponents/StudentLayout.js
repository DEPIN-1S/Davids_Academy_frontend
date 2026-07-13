import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar/Navbar";
import "../../styles/AdminStyles/AdminLayout.css";
const StudentLayout = () => {
    const [isOpen] = useState(false);

    return (
        <div className="main-layout-container">
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
