import React from "react";
import { Route } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout";
import Home from "../pages/Home";
import AboutPage from "../pages/AboutPage";
import CoursesPage from "../pages/CoursesPage";
import TestimonialsPage from "../pages/TestimonialsPage";
import ContactPage from "../pages/ContactPage";
import SampleQuestionsPage from "../pages/SampleQuestionnaire";
import SampleQuestionnaire from "../components/SampleQuestionnaire";
import LoginPage from "../pages/LoginPage";
import ExamContainer from "../components/StudentComponents/ExamContainer"; // Adjust path

const HomeRoutes = () => (
  <>
    <Route element={<LandingLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/contact-us" element={<ContactPage />} />
      <Route path="/sample-questionnaire" element={<SampleQuestionnaire />} />
      <Route path="/sample-questions" element={<SampleQuestionsPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* { Add route for sample exam (no auth, no navbar) */} 
      <Route path="/exam" element={<ExamContainer />} />  
    </Route>
  </>
);

export default HomeRoutes;