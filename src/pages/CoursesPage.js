import React from 'react';
import { useSelector } from 'react-redux';
import CourseHeader from '../components/CourseHeader';
import CourseCard from '../components/CourseCard';
import CourseContactForm from '../components/CourseContactForm';

const CoursesPage = () => {
  // Get the courses list from Redux (assuming slice is course.list)
  const courses = useSelector((state) => state.course.list);

  return (
    <section>
      <CourseHeader />

      {courses && courses.map((course, idx) => (
        <CourseCard
          key={course.cs_id || course.id || idx}
          title={course.name || course.title}
          description={course.cs_sub_title || course.overview || course.description}
          highlights={
            // Accepts `points` field (if exists in Redux),
            // or transforms a comma-separated string like cs_desc_points
            course.points ||
            (typeof course.cs_desc_points === 'string'
              ? course.cs_desc_points.split(',').map(s => s.trim())
              : Array.isArray(course.cs_desc_points)
                ? course.cs_desc_points
                : [])
          }
          image={course.image || course.cs_image}
          reverse={idx % 2 !== 0}
        />
      ))}

      <CourseContactForm />
    </section>
  );
};

export default CoursesPage;
