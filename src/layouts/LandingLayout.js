// src/layouts/LandingLayout.js
import Navbar from '../components/Navbar';
import Footer from '../components/NewsletterFooter';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css'
const LandingLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet className="page-layout" />
            <Footer />
        </>
    );
};

export default LandingLayout;
