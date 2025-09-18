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
import useSecurityRestrictions from "./hooks/useSecurityRestrictions"; // ✅ Import hook
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateUser());
  }, [dispatch]);
 /*  // ✅ Apply restrictions globally
 useSecurityRestrictions(); */
  return (
    <FileProvider>
      <Routes>
        {HomeRoutes()}
        {StudentRoutes()}
        {AdminRoutes()}
      </Routes>
    </FileProvider>
  );
};

export default App;
