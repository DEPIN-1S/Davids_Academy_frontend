import React from 'react';

// Adjust paths and make sure file extensions match .js
import Hero from '../components/Hero';
import About from '../components/About';
import Courses from '../components/Courses';
import SampleQuestionnaire from '../components/SampleQuestionnaire';
import WhyChoose from '../components/WhyChoose';
import SuccessStories from '../components/SuccessStories';
import ClassesAvailable from '../components/ClassesAvailable';

const Home = () => {
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
