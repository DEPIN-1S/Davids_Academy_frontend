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
        <Route path="/student/question-bank" element={<ProtectedRoutes allowedRoles={['2']}><QuestionBankPage /></ProtectedRoutes>} />
        <Route path="/my-statistics" element={<ProtectedRoutes allowedRoles={['2']}><StatisticsPage /></ProtectedRoutes>} />
        <Route path="/recorded-class" element={<ProtectedRoutes allowedRoles={['2']}><RecordedClassesPage /></ProtectedRoutes>} />
        <Route path="/notes" element={<ProtectedRoutes allowedRoles={['2']}><NotesPage /></ProtectedRoutes>} />
        <Route path="/mock-test" element={<ProtectedRoutes allowedRoles={['2']}><MockTestPage /></ProtectedRoutes>} />
        <Route path="/previous-tests" element={<ProtectedRoutes allowedRoles={['2']}><PreviousTestPage /></ProtectedRoutes>} />
        <Route path="/radio-question" element={<RadioButtonQuestionPage />} />
        <Route path="/reveal-answer-radio" element={<RevealAnswerRadioPage />} />
        <Route path="/dropdown-question" element={<DropdownQuestionPage />} />
        <Route path="/dragdrop-question" element={<DragDropQuestionPage />} />
        <Route path="/multi-radio-question" element={<MultiRadioQuestionPage />} />
        <Route path="/sort-question" element={<SortQuestionPage />} />
        <Route path="/sentence-question" element={<SentenceQuestionPage />} />
        <Route path="/drop-sort-question" element={<DropSortQuestionPage />} />
        <Route path="/score" element={<ProtectedRoutes allowedRoles={['2']}><ScorePage /></ProtectedRoutes>} />
    </>
);

export default StudentRoutes;
