import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CourseHeader from '../components/CourseHeader';
import CourseCard from '../components/CourseCard';
import CourseContactForm from '../components/CourseContactForm';
import { fetchCourses } from '../features/courses/courseSlice'; // Make sure path is correct

const CoursesPage = () => {
  const dispatch = useDispatch();

  // Get course objects and loading/error flags from Redux state
  const { list: courses, loading, error } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchCourses()); // Fetch courses on page load
  }, [dispatch]);

  return (
    <section>
      <CourseHeader />

      {loading && (
        <div style={{ textAlign: 'center', margin: '2rem' }}>
          <span>Loading courses...</span>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '2rem' }}>
          <span>Error loading courses: {error}</span>
        </div>
      )}

      {!loading && !error && courses && courses.length > 0 && (
        courses.map((course, idx) => {
          // Prepare fields with proper fallback according to your previous logic
          const key = course.cs_id || course.id || idx;
          const title = course.cs_name || course.title || "Untitled Course";
          const description = course.cs_sub_title || course.overview || course.description || "";
          const highlights = course.points
            ? course.points
            : typeof course.cs_desc_points === 'string'
              ? course.cs_desc_points.split(',').map(s => s.trim())
              : Array.isArray(course.cs_desc_points)
                ? course.cs_desc_points
                : [];
          const image = course.image || course.cs_image || "";

          return (
            <CourseCard
              key={key}
              title={title}
              description={description}
              highlights={highlights}
              image={image}
              reverse={idx % 2 !== 0}
            />
          );
        })
      )}

      {!loading && !error && (!courses || courses.length === 0) && (
        <div style={{ textAlign: 'center', margin: '2rem' }}>
          <span>No courses found.</span>
        </div>
      )}

      <CourseContactForm />
    </section>
  );
};

export default CoursesPage;
