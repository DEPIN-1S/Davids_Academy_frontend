import React from 'react';
import CourseHeader from '../components/CourseHeader';
import CourseCard from '../components/CourseCard';
import CourseContactForm from '../components/CourseContactForm';
import coursesData from '../data/coursesData.json'; // import JSON file

const CoursesPage = () => {
  return (
     <section >
      <CourseHeader />

      {coursesData.map((course, idx) => (
        <CourseCard
          key={idx}
          title={course.title}
          description={course.overview}
          highlights={course.points}
          image={course.image}
          reverse={idx % 2 !== 0}
        />
      ))}

      <CourseContactForm />
    </section>
  );
};

export default CoursesPage;
