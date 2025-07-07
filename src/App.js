import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import Courses from "./components/Courses";
import SampleQuestionnaire from "./components/SampleQuestionnaire";
import WhyChoose from "./components/WhyChoose";
import SuccessStories from "./components/SuccessStories";
import Classes from "./components/Classes";
import NewsletterFooter from "./components/NewsletterFooter";

function App() {
  return (
    <>
      <Navbar />
       <main className="page-layout">
        <Hero />
        <Stats />
        <About />
        <Courses />
        <SampleQuestionnaire />
        <WhyChoose />
        <SuccessStories />
        <Classes />
      </main>
      <NewsletterFooter />
     
    </>
  );
}

export default App;

