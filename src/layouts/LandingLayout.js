// src/layouts/LandingLayout.js
import Navbar from '../components/Navbar';
import Footer from '../components/NewsletterFooter';
import { Outlet } from 'react-router-dom';

const LandingLayout = () => {
    return (
        <>
            <Navbar />
            <main class="page-layout">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default LandingLayout;
