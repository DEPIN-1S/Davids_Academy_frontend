import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import QuestionBankPage from "../pages/DashboardPages/QuestionBankPage";
import StatisticsPage from "../pages/DashboardPages/StatisticsPage";
import RecordedClassesPage from "../pages/DashboardPages/RecordedClassesPage";
import NotesPage from "../pages/DashboardPages/NotesPage";
import MockTestPage from "../pages/DashboardPages/MockTestPage";
import PreviousTestPage from "../pages/DashboardPages/PreviousTestPage";
import RadioButtonQuestionPage from "../pages/DashboardPages/RadioButtonQuestionPage";
import RevealAnswerRadioPage from "../pages/DashboardPages/RevealAnswerRadioPage";
import DropdownQuestionPage from "../pages/DashboardPages/DropdownQuestionPage";
import DragDropQuestionPage from "../pages/DashboardPages/DragDropQuestionPage";
import MultiRadioQuestionPage from "../pages/DashboardPages/MultiRadioQuestionPage";
import SortQuestionPage from "../pages/DashboardPages/SortQuestionPage";
import SentenceQuestionPage from "../pages/DashboardPages/SentenceQuestionPage";
import DropSortQuestionPage from "../pages/DashboardPages/DropSortQuestionPage";
import ScorePage from "../pages/DashboardPages/ScorePage";

const StudentRoutes = () => (
    <>
        <Route path="/student/question-bank" element={<ProtectedRoutes allowedRoles={['student']}><QuestionBankPage /></ProtectedRoutes>} />
        <Route path="/my-statistics" element={<ProtectedRoutes allowedRoles={['student']}><StatisticsPage /></ProtectedRoutes>} />
        <Route path="/recorded-class" element={<ProtectedRoutes allowedRoles={['student']}><RecordedClassesPage /></ProtectedRoutes>} />
        <Route path="/notes" element={<ProtectedRoutes allowedRoles={['student']}><NotesPage /></ProtectedRoutes>} />
        <Route path="/mock-test" element={<ProtectedRoutes allowedRoles={['student']}><MockTestPage /></ProtectedRoutes>} />
        <Route path="/previous-tests" element={<ProtectedRoutes allowedRoles={['student']}><PreviousTestPage /></ProtectedRoutes>} />

        {/* ✅ Added ProtectedRoutes to all question-related pages */}
        <Route path="/radio-question" element={<ProtectedRoutes allowedRoles={['student']}><RadioButtonQuestionPage /></ProtectedRoutes>} />
        <Route path="/reveal-answer-radio" element={<ProtectedRoutes allowedRoles={['student']}><RevealAnswerRadioPage /></ProtectedRoutes>} />
        <Route path="/dropdown-question" element={<ProtectedRoutes allowedRoles={['student']}><DropdownQuestionPage /></ProtectedRoutes>} />
        <Route path="/dragdrop-question" element={<ProtectedRoutes allowedRoles={['student']}><DragDropQuestionPage /></ProtectedRoutes>} />
        <Route path="/multi-radio-question" element={<ProtectedRoutes allowedRoles={['student']}><MultiRadioQuestionPage /></ProtectedRoutes>} />
        <Route path="/sort-question" element={<ProtectedRoutes allowedRoles={['student']}><SortQuestionPage /></ProtectedRoutes>} />
        <Route path="/sentence-question" element={<ProtectedRoutes allowedRoles={['student']}><SentenceQuestionPage /></ProtectedRoutes>} />
        <Route path="/drop-sort-question" element={<ProtectedRoutes allowedRoles={['student']}><DropSortQuestionPage /></ProtectedRoutes>} />

        <Route path="/score" element={<ProtectedRoutes allowedRoles={['student']}><ScorePage /></ProtectedRoutes>} />
    </>
);

export default StudentRoutes;
