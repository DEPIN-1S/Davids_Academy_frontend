import React from 'react';
import CourseHeader from '../components/CourseHeader';
import CourseCard from '../components/CourseCard';
import CourseContactForm from '../components/CourseContactForm';
const coursesData = [
  {
    title: 'Prometric Coaching',
    location: 'Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait',
    overview:
      'Prometric coaching is designed to help you pass medical exams required for licensure in GCC countries.',
    image: '/images/prometric.jpg',
    points: [
      'Structured question practice',
      'Experienced faculty',
      'Mock exams',
      'Personalized coaching and materials',
    ],
  },
  {
    title: 'DHA Coaching',
    location: 'Dubai',
    overview:
      'Training for Dubai Health Authority exams covering key medical competencies and formats.',
    image: '/images/courses/dha.jpg',
    points: [
      'Experienced mentor support',
      'Updated materials',
      'Placement assistance',
    ],
  },
  {
    title: 'HAAD Coaching',
    location: 'Abu Dhabi',
    overview:
      'HAAD (DOH) coaching focuses on preparing healthcare professionals to clear licensure exams in Abu Dhabi.',
    image: '/images/courses/haad.jpg',
    points: [
      'Targeted exam practice',
      'Concept clarification',
      'Doubt-clearing sessions',
      'Flexible batch timings',
    ],
  },
  {
    title: 'MOH Coaching',
    location: 'UAE (Ministry of Health)',
    overview:
      'MOH training prepares candidates for working under the UAE Ministry of Health regulations and standards.',
    image: '/images/courses/moh.jpg',
    points: [
      'MOH-specific mock tests',
      'Advanced preparation materials',
      'Strategy sessions',
      'Guided mentorship',
    ],
  },
  {
    title: 'NCLEX-RN',
    location: 'USA & Canada',
    overview:
      'NCLEX-RN is a standardized test that nurses must pass to practice in the United States and Canada.',
    image: '/images/courses/nclex.jpg',
    points: [
      'Adaptive mock tests',
      'NCLEX-focused study plan',
      'Critical thinking development',
      'Personalized feedback',
    ],
  },
  {
    title: 'Crash Courses & Weekend Batches',
    location: 'Flexible (Online/Offline)',
    overview:
      'Intensive short-term programs designed for working professionals and urgent exam prep needs.',
    image: '/images/courses/crash.jpg',
    points: [
      'High-yield question sets',
      'Weekend-focused sessions',
      'Time management tips',
      'Quick revision packs',
    ],
  },
];
const CoursesPage = () => {
  return (
    <div>
      <CourseHeader />

      {coursesData.map((course, idx) => (
        <CourseCard key={idx} {...course} />
      ))}

      <CourseContactForm />
    </div>
  );
};

export default CoursesPage;
