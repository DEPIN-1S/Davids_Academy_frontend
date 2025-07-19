import React from "react";
import { Route } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout";
import Home from "../pages/Home";
import AboutPage from "../pages/AboutPage";
import CoursesPage from "../pages/CoursesPage";
import TestimonialsPage from "../pages/TestimonialsPage";
import ContactPage from "../pages/ContactPage";
import SampleQuestionnaire from "../pages/SampleQuestionnaire";
import LoginPage from "../pages/LoginPage";

const HomeRoutes = () => (
    <>
        <Route element={<LandingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/sample-questionnaire" element={<SampleQuestionnaire />} />
            <Route path="/login" element={<LoginPage />} />
        </Route>
    </>
);

export default HomeRoutes;
