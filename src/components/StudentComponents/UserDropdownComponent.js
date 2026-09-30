import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/user/userSlice';
import '../../styles/DashboardStyles/UserDropdownComponent.css';

const UserDropdownComponent = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = '/login';
    };

    // Close dropdown if click is outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <div className="user-display" onClick={() => setOpen((prev) => !prev)}>
                <div className="avatar-circle">
                    <img src="/images/loginAvatar.png" alt="Avatar" />
                </div>
                <div className="user-meta">
                    <span className="name">{user?.name}</span>
                    <span className="email">{user?.email}</span>
                </div>
                <span className="arrow">▾</span>
            </div>
            {open && (
                <div className="drop-menu">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default UserDropdownComponent;
