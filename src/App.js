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
      </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
