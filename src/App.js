import React, { useEffect } from "react";
import { Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hydrateUser } from "./features/user/userSlice";
import HomeRoutes from "./routes/HomeRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Layout.css";
import { FileProvider } from "./context/FileContext";
// import useSecurityRestrictions from "./hooks/useSecurityRestrictions"; // ✅ Import hook
import { ToastContainer } from "react-toastify";
import ScrollToHashElement from "./ScrollToHashElement";
import ScrollToTop from "./ScrollToTop";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateUser());
  }, [dispatch]);
  /*  // ✅ Apply restrictions globally
  useSecurityRestrictions(); */
  return (
    <FileProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ScrollToHashElement/>
       <ScrollToTop />
      <Routes>
        {HomeRoutes()}
        {StudentRoutes()}
        {AdminRoutes()}
      </Routes>
    </FileProvider>
  );
};

export default App;
