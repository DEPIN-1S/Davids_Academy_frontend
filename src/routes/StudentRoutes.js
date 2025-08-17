import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import QuestionBankPage from "../pages/StudentPages/QuestionBankPage";
import RecordedClassesPage from "../pages/StudentPages/RecordedClassesPage";
import NotesPage from "../pages/StudentPages/NotesPage";
import MockTestPage from "../pages/StudentPages/MockTestPage";
import PreviousTestPage from "../pages/StudentPages/PreviousTestPage";
import RadioButtonQuestionPage from "../pages/StudentPages/RadioButtonQuestionPage";
import RevealAnswerRadioPage from "../pages/StudentPages/RevealAnswerRadioPage";
import DropdownQuestionPage from "../pages/StudentPages/DropdownQuestionPage";
import DragDropQuestionPage from "../pages/StudentPages/DragDropQuestionPage";
import MultiRadioQuestionPage from "../pages/StudentPages/MultiRadioQuestionPage";
import SortQuestionPage from "../pages/StudentPages/SortQuestionPage";
import SentenceQuestionPage from "../pages/StudentPages/SentenceQuestionPage";
import DropSortQuestionPage from "../pages/StudentPages/FillInQuestionPage";
import ScorePage from "../pages/StudentPages/ScorePage";
import StudentLayout from "../components/StudentComponents/StudentLayout";
import ExamContainer from "../components/StudentComponents/ExamContainer";
const StudentRoutes = () => (
    <>
        <Route element={<StudentLayout />}>
            <Route path="/student/question-bank" element={<ProtectedRoutes allowedRoles={['student']}><QuestionBankPage /></ProtectedRoutes>} />
            <Route path="/student/recorded-class" element={<ProtectedRoutes allowedRoles={['student']}><RecordedClassesPage /></ProtectedRoutes>} />
            <Route path="/student/notes" element={<ProtectedRoutes allowedRoles={['student']}><NotesPage /></ProtectedRoutes>} />
            <Route path="/student/mock-test" element={<ProtectedRoutes allowedRoles={['student']}><MockTestPage /></ProtectedRoutes>} />
            <Route path="/student/previous-tests" element={<ProtectedRoutes allowedRoles={['student']}><PreviousTestPage /></ProtectedRoutes>} />
            <Route path="/student/exam" element={<ProtectedRoutes allowedRoles={['student']}><ExamContainer /></ProtectedRoutes>} />
            {/* question routers end */}
            <Route
                path="/student/mcq/:id"
                element={
                    <ProtectedRoutes allowedRoles={['student']}>
                        <RadioButtonQuestionPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/student/dropdown-question/:id"
                element={
                    <ProtectedRoutes allowedRoles={['student']}>
                        <DropdownQuestionPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/student/dragdrop-question/:id"
                element={
                    <ProtectedRoutes allowedRoles={['student']}>
                        <DragDropQuestionPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/student/multi-radio-question/:id"
                element={
                    <ProtectedRoutes allowedRoles={['student']}>
                        <MultiRadioQuestionPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/student/sort-question/:id"
                element={
                    <ProtectedRoutes allowedRoles={['student']}>
                        <SortQuestionPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/student/sentence-question/:id"
                element={
                    <ProtectedRoutes allowedRoles={['student']}>
                        <SentenceQuestionPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/student/fill-in-question/:id"
                element={
                    <ProtectedRoutes allowedRoles={['student']}>
                        <DropSortQuestionPage />
                    </ProtectedRoutes>
                }
            />

            {/* question routers start */}
            {/* answer routes start */}
            <Route path="/student/reveal-answer" element={<ProtectedRoutes allowedRoles={['student']}><RevealAnswerRadioPage /></ProtectedRoutes>} />
            {/* answer routes end */}

            <Route path="/student/score" element={<ProtectedRoutes allowedRoles={['student']}><ScorePage /></ProtectedRoutes>} />
        </Route>
    </>
);

export default StudentRoutes;
