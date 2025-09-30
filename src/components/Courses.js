import React, { useEffect } from 'react';
import '../styles/Courses.css';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../features/courses/courseSlice';
import { useDispatch } from 'react-redux';

const courses = [
  {
    title: 'NCLEX Coaching',
    description: 'Prepare to crack the NCLEX-RN with comprehensive, practice-focused guidance from our expert mentors.',
    duration: '6 months',
  },
  {
    title: 'Prometric Coaching',
    description: 'Prepare for Gulf countries’ Prometric exams with targeted question practice and expert support.',
    duration: '3 months',
  },
  {
    title: 'DHA – UAE Exam Prep',
    description: 'Expert mentorship to confidently clear the Dubai Health Authority (DHA) exam and advance your international nursing career.',
    duration: '3 months',
  },
];



const Courses = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCourses());
    console.log("courses in course management ::::", fetchCourses);
  }, [dispatch]);


  return (
    <section id="HomeCourses" className="our-courses">
      <h2 className="courses-title">
        <img src="/images/studentIcon.png" alt="cap icon" className="cap-icon" />
        Our Courses
      </h2>

      <div className="courses-list">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p className="duration">
              <strong>Duration:</strong> {course.duration}
            </p>
            <button className="learn-more">Learn More →</button>
          </div>
        ))}
      </div>

      <div className="courses-footer">
        <div className="arrows">
          {/*  <button className="circle-btn">←</button>
          <button className="circle-btn">→</button> */}
        </div>
        {/*   <Link to="/courses" >
          <button className="view-all">View All →</button>
        </Link> */}
      </div>
    </section>
  );
};

export default Courses;
