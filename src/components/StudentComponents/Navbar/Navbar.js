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
import UserDropdownComponent from "../UserDropdownComponent";
import { logout } from '../../../features/user/userSlice';
const NavBar = () => {
    const location = useLocation();
    // Define route-specific headings, subtitles, and icons
    const routeConfig = {
        "/student/question-bank": {
            title: "Question Bank",
            subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            // icon: <FaThLarge />,
            showWave: false
        },
        "/student/recorded-class": {
            title: "Recorded Classes",
            subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            // icon: <FaBook />
        },
        "/student/notes": {
            title: "Notes",
            subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            // icon: <FaClipboardList />
        },
        "/student/tests": {
            title: "Tests",
            subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            // icon: <FaPhone />
        }
    };

    // Get current route config with enhanced path matching
    const getPageConfig = () => {
        const path = location.pathname;

        // Handle question creation flow
        if (path.includes('/student/question-type')) {
            return {
                title: "Create Question",
                subtitle: "Select question type and build assessments for your courses.",
                icon: <FaQuestionCircle />
            };
        }

        if (path.includes('/student/answer-explain')) {
            return {
                title: "Question Explanation",
                subtitle: "Add detailed explanations and additional information for your question.",
                icon: <FaLightbulb />
            };
        }

        // Handle student management sub-pages
        // if (path.includes('/student/add-student')) {
        //     return {
        //         title: "Add New Student",
        //         subtitle: "Register a new student and assign them to courses.",
        //         icon: <FaPlus />
        //     };
        // }

        // if (path.includes('/student/edit-student')) {
        //     return {
        //         title: "Edit Student",
        //         subtitle: "Update student information and course assignments.",
        //         icon: <FaEdit />
        //     };
        // }

        // // Handle course management sub-pages
        // if (path.includes('/student/add-course')) {
        //     return {
        //         title: "Add New Course",
        //         subtitle: "Create a comprehensive course for your students.",
        //         icon: <FaPlus />
        //     };
        // }

        // if (path.includes('/student/edit-course')) {
        //     return {
        //         title: "Edit Course",
        //         subtitle: "Update course content and settings.",
        //         icon: <FaEdit />
        //     };
        // }

        // Return the matched config or default
        return routeConfig[path] || {
            title: "Question Bank",
            subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            // icon: <FaThLarge />
        };
    };

    const pageConfig = getPageConfig();

    return (
        <nav className="admin-navbar">
            <div className="navbar-content">
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
