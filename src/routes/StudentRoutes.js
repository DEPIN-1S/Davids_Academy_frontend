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
import StudentLayout from "../components/StudentComponents/StudentLayout";
const StudentRoutes = () => (
    <>
        <Route element={<StudentLayout />}>
            <Route path="/student/question-bank" element={<ProtectedRoutes allowedRoles={['student']}><QuestionBankPage /></ProtectedRoutes>} />
            <Route path="/student/my-statistics" element={<ProtectedRoutes allowedRoles={['student']}><StatisticsPage /></ProtectedRoutes>} />
            <Route path="/student/recorded-class" element={<ProtectedRoutes allowedRoles={['student']}><RecordedClassesPage /></ProtectedRoutes>} />
            <Route path="/student/notes" element={<ProtectedRoutes allowedRoles={['student']}><NotesPage /></ProtectedRoutes>} />
            <Route path="/student/mock-test" element={<ProtectedRoutes allowedRoles={['student']}><MockTestPage /></ProtectedRoutes>} />
            <Route path="/student/previous-tests" element={<ProtectedRoutes allowedRoles={['student']}><PreviousTestPage /></ProtectedRoutes>} />
            <Route path="/student/radio-question" element={<ProtectedRoutes allowedRoles={['student']}><RadioButtonQuestionPage /></ProtectedRoutes>} />
            <Route path="/student/reveal-answer-radio" element={<ProtectedRoutes allowedRoles={['student']}><RevealAnswerRadioPage /></ProtectedRoutes>} />
            <Route path="/student/dropdown-question" element={<ProtectedRoutes allowedRoles={['student']}><DropdownQuestionPage /></ProtectedRoutes>} />
            <Route path="/student/dragdrop-question" element={<ProtectedRoutes allowedRoles={['student']}><DragDropQuestionPage /></ProtectedRoutes>} />
            <Route path="/student/multi-radio-question" element={<ProtectedRoutes allowedRoles={['student']}><MultiRadioQuestionPage /></ProtectedRoutes>} />
            <Route path="/student/sort-question" element={<ProtectedRoutes allowedRoles={['student']}><SortQuestionPage /></ProtectedRoutes>} />
            <Route path="/student/sentence-question" element={<ProtectedRoutes allowedRoles={['student']}><SentenceQuestionPage /></ProtectedRoutes>} />
            <Route path="/student/drop-sort-question" element={<ProtectedRoutes allowedRoles={['student']}><DropSortQuestionPage /></ProtectedRoutes>} />
            <Route path="/student/score" element={<ProtectedRoutes allowedRoles={['student']}><ScorePage /></ProtectedRoutes>} />
        </Route>
    </>
);

export default StudentRoutes;
