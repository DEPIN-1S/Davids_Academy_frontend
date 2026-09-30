import React, { useEffect } from 'react';

// Adjust paths and make sure file extensions match .js
import Hero from '../components/Hero';
import About from '../components/About';
import Courses from '../components/Courses';
import SampleQuestionnaire from '../components/SampleQuestionnaire';
import WhyChoose from '../components/WhyChoose';
import SuccessStories from '../components/SuccessStories';
import ClassesAvailable from '../components/ClassesAvailable';
import { useLocation } from 'react-router-dom';

const Home = () => {

  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <main>
      <Hero />
      <About />
      <Courses />
      <SampleQuestionnaire />
      <WhyChoose />
      <SuccessStories />
      <ClassesAvailable />
    </main>
  );
};

export default Home;
