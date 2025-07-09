import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/NewsletterFooter';

import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import SampleQuestionnaire from './pages/SampleQuestionnaire';
import LoginPage from './pages/LoginPage';
import QuestionBankPage from './pages/DashboardPages/QuestionBankPage';
import StatisticsPage from './pages/DashboardPages/StatisticsPage';
import './styles/Layout.css';

const App = () => {
  return (
    <>
      <Navbar />
      <div class="page-layout">
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/sample-questionnaire" element={<SampleQuestionnaire />} />
        {/* protected components */}
        <Route path="/question-bank" element={<QuestionBankPage />} />
        <Route path="/my-statistics" element={<StatisticsPage />} />
         <Route path="/login" element={<LoginPage />} />
         
      </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
