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
import RecordedClassesPage from './pages/DashboardPages/RecordedClassesPage';
import NotesPage from './pages/DashboardPages/NotesPage';
import MockTestPage from './pages/DashboardPages/MockTestPage';
import PreviousTestPage from './pages/DashboardPages/PreviousTestPage';
import RadioButtonQuestionPage from './pages/DashboardPages/RadioButtonQuestionPage';
import RevealAnswerRadioPage from './pages/DashboardPages/RevealAnswerRadioPage';
import DropdownQuestionPage from './pages/DashboardPages/DropdownQuestionPage';
import DragDropQuestionPage from './pages/DashboardPages/DragDropQuestionPage';
import MultiRadioQuestionPage from './pages/DashboardPages/MultiRadioQuestionPage';
import SortQuestionPage from './pages/DashboardPages/SortQuestionPage';
import SentenceQuestionPage from './pages/DashboardPages/SentenceQuestionPage';
import DropSortQuestionPage from './pages/DashboardPages/DropSortQuestionPage';
import './styles/Layout.css';
import ScorePage from './pages/DashboardPages/ScorePage';

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
        <Route path="/recorded-class" element={<RecordedClassesPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/mock-test" element={<MockTestPage />} />
        <Route path="/previous-tests" element={<PreviousTestPage />} />
        <Route path="/radio-question" element={<RadioButtonQuestionPage />} />
        <Route path="/reveal-answer-radio" element={<RevealAnswerRadioPage />} />
        <Route path="/dropdown-question" element={<DropdownQuestionPage />} />
        <Route path="/dragdrop-question" element={<DragDropQuestionPage />} />
        <Route path="/multi-radio-question" element={<MultiRadioQuestionPage />} />
        <Route path="/sort-question" element={<SortQuestionPage />} />
        <Route path="/sentence-question" element={<SentenceQuestionPage />} />
        <Route path="/drop-sort-question" element={<DropSortQuestionPage />} />
         <Route path="/score" element={<ScorePage />} />
        {/* protected components end */}
         <Route path="/login" element={<LoginPage />} />
         
      </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
