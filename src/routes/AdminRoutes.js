import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLayout from "../components/AdminComponents/AdminLayout";
import AdminDashboardPage from "../pages/AdminPages/AdminDashboardPage";
import StudentManage from "../pages/AdminPages/StudentManage";
import QManagementPage from "../pages/AdminPages/QManagementPage";

const AdminRoutes = () => (
    <>
        <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={
                <ProtectedRoutes allowedRoles={[1]}>
                    <AdminDashboardPage />
                </ProtectedRoutes>
            } />
            <Route path="/student-manage" element={<ProtectedRoutes allowedRoles={[1]}><StudentManage /></ProtectedRoutes>} />
            <Route path="/question-management" element={<ProtectedRoutes allowedRoles={[1]}><QManagementPage /></ProtectedRoutes>} />
        </Route>
    </>
);

export default AdminRoutes;
