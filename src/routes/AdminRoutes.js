import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLayout from "../components/AdminComponents/AdminLayout";
import AdminDashboardPage from "../pages/AdminPages/AdminDashboardPage";
import StudentManage from "../pages/AdminPages/StudentManage";
import AddStudentForm from "../components/AdminComponents/AddStudentForm";
import QManagementPage from "../pages/AdminPages/QManagementPage";
import QuestionTypeComponent from "../components/AdminComponents/QuestionTypeComponent";
import McqQuestionContent from "../components/AdminComponents/McqQuestionContent";
import DropdownQuestionContent from "../components/AdminComponents/DropdownQuestionContent";
import DragdropQuestionContent from "../components/AdminComponents/DragdropQuestionContent";
import MultiradioQuestionContent from "../components/AdminComponents/MultiradioQuestionContent";
import SortQuestionContent from "../components/AdminComponents/SortQuestionContent";
import SentenceHiglightContent from "../components/AdminComponents/SentenceHiglightContent";
import FillinQuestionContent from "../components/AdminComponents/FillinQuestionContent";
import McqAnswerExplanation from "../components/AdminComponents/AnswerExplain";
import MetaInfoComponent from '../components/AdminComponents/MetaInfoComponent';
import TestCreateComponent from "../components/AdminComponents/TestCreateComponent";
import RecordedClass from '../components/AdminComponents/RecordedClass'
import CourseManagement from "../components/AdminComponents/CourseManagementComponent";
import AddCourseComponent from "../components/AdminComponents/AddCourseComponent";
import UploadThumbnailComponent from "../components/AdminComponents/UploadThumbnailComponent";
import RecordedClassInfoComponent from "../components/AdminComponents/RecordClassComponent";
import EnquireLeadComponent from "../components/AdminComponents/EnquireLeadComponent";
import ExamTypeComponent from "../components/AdminComponents/ExamTypeComponent";
import SelectCourseComponent from "../components/AdminComponents/SelectCourseComponent";

const AdminRoutes = () => (
    <>
        <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <AdminDashboardPage />
                </ProtectedRoutes>
            } />
            <Route path="/admin/student-manage" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <StudentManage />
                </ProtectedRoutes>
            } />
            <Route path="/admin/student-form" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <AddStudentForm />
                </ProtectedRoutes>
            } />
            <Route path="/admin/question-management" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <QManagementPage />
                </ProtectedRoutes>
            } />
            <Route path="/admin/question-type" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <QuestionTypeComponent />
                </ProtectedRoutes>
            } />

            {/* ✅ Question Content Creation Routes */}
            <Route path="/admin/mcq-content" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <McqQuestionContent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/dropdown-content" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <DropdownQuestionContent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/dragdrop-content" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <DragdropQuestionContent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/multiradio-content" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <MultiradioQuestionContent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/sort-content" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <SortQuestionContent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/sentence-content" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <SentenceHiglightContent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/fill-content" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <FillinQuestionContent />
                </ProtectedRoutes>
            } />

            {/* ✅ Question Management Flow Routes */}
            <Route path="/admin/answer-explain" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <McqAnswerExplanation />
                </ProtectedRoutes>
            } />
            <Route path="/admin/meta-info" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <MetaInfoComponent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/create-question" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <TestCreateComponent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/selectCourse" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <SelectCourseComponent />
                </ProtectedRoutes>
            } />


            <Route path="/admin/exam-type" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <ExamTypeComponent />
                </ProtectedRoutes>
            } />

            {/* ✅ Course Management Routes */}
            <Route path="/admin/course-management" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <CourseManagement />
                </ProtectedRoutes>
            } />
            <Route path="/admin/course-form" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <AddCourseComponent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/course-form/:id" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <AddCourseComponent />
                </ProtectedRoutes>} />


            {/* ✅ Recorded Class Management Routes */}
            <Route path="/admin/recorded-class" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <RecordedClass />
                </ProtectedRoutes>
            } />
            <Route path="/admin/upload-thumbnail" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <UploadThumbnailComponent />
                </ProtectedRoutes>
            } />
            <Route path="/admin/record-class-info" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <RecordedClassInfoComponent />
                </ProtectedRoutes>
            } />

            {/* ✅ Enquiry Management Route */}
            <Route path="/admin/enquire-lead" element={
                <ProtectedRoutes allowedRoles={['admin']}>
                    <EnquireLeadComponent />
                </ProtectedRoutes>
            } />
        </Route>
    </>
);

export default AdminRoutes;
