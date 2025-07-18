import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
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
import ScorePage from './pages/DashboardPages/ScorePage';
import MainLayout from './components/AdminComponents/MainLayout';
import AdminDashboardPage from './pages/AdminPages/Dashboard/AdminDashboardPage';
import StudentManage from './pages/AdminPages/StudentManage/StudentManage'

import './styles/Layout.css';
import ProtectedRoutes from './routes/ProtectedRoutes';
import { hydrateUser } from './features/user/userSlice';
import { useDispatch } from 'react-redux'; // for Redux
import { useEffect } from 'react'; // for lifecycle logic
import "bootstrap/dist/css/bootstrap.min.css";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateUser()); // 👈 this sets user/token from localStorage to redux
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/sample-questionnaire" element={<SampleQuestionnaire />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        {/*student protected components */}
        <Route
          path="/question-bank"
          element={
            <ProtectedRoutes allowedRoles={['student']}>
              <QuestionBankPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/my-statistics"
          element={
            <ProtectedRoutes allowedRoles={['student']}>
              <StatisticsPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/recorded-class"
          element={
            <ProtectedRoutes allowedRoles={['student']}>
              <RecordedClassesPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoutes allowedRoles={['student']}>
              <NotesPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/mock-test"
          element={
            <ProtectedRoutes allowedRoles={['student']}>
              <MockTestPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/previous-tests"
          element={
            <ProtectedRoutes allowedRoles={['student']}>
              <PreviousTestPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/radio-question"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <RadioButtonQuestionPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/reveal-answer-radio"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <RevealAnswerRadioPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/dropdown-question"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <DropdownQuestionPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/dragdrop-question"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <DragDropQuestionPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/multi-radio-question"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <MultiRadioQuestionPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/sort-question"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <SortQuestionPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/sentence-question"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <SentenceQuestionPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/drop-sort-question"
          element={
            // <ProtectedRoutes allowedRoles={['student']}>
            <DropSortQuestionPage />
            // </ProtectedRoutes>
          }
        />
        <Route
          path="/score"
          element={
            <ProtectedRoutes allowedRoles={['student']}>
              <ScorePage />
            </ProtectedRoutes>
          }
        />
        {/*student protected components end */}
        {/* admin components start */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/student-manage" element={<StudentManage />} />
        </Route>
        {/* admin components end */}
      </Routes>
    </>
  );
};

export default App;
