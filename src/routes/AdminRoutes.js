import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLayout from "../components/AdminComponents/AdminLayout";
import AdminDashboardPage from "../pages/AdminPages/AdminDashboardPage";
import StudentManage from "../pages/AdminPages/StudentManage";
import QManagementPage from "../pages/AdminPages/QManagementPage";
import QuestionTypeComponent from "../components/AdminComponents/QuestionTypeComponent";
import McqQuestionContent from "../components/AdminComponents/McqQuestionContent";
import McqAnswerExplanation from "../components/AdminComponents/McqAnswerExplanation";
import MetaInfoComponent from '../components/AdminComponents/MetaInfoComponent';
import TestCreateComponent from "../components/AdminComponents/TestCreateComponent";
import CourseManagement from '../components/AdminComponents/CourseManagement'
import UploadThumbnailComponent from "../components/AdminComponents/UploadThumbnailComponent";
import RecordedClassInfoComponent from "../components/AdminComponents/RecordClassComponent";
import EnquireLeadComponent from "../components/AdminComponents/EnquireLeadComponent";
const AdminRoutes = () => (
    <>
        <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <AdminDashboardPage />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/student-manage" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <StudentManage />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/question-management" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <QManagementPage />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/question-type" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <QuestionTypeComponent />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/mcq-content" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <McqQuestionContent />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/answer-explain" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <McqAnswerExplanation />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/meta-info" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <MetaInfoComponent />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/create-question" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <TestCreateComponent />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/course-management" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <CourseManagement />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/upload-thumbnail" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <UploadThumbnailComponent />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/record-class-info" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <RecordedClassInfoComponent />
                // </ProtectedRoutes>
            } />
            <Route path="/admin/enquire-lead" element={
                // <ProtectedRoutes allowedRoles={[1]}>
                <EnquireLeadComponent />
                // </ProtectedRoutes>
            } />
        </Route>

    </>
);

export default AdminRoutes;
