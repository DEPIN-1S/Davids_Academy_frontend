import React, { useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../../styles/AdminStyles/StudentManage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../../features/students/studentSlice";


const StudentManage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.students);
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);
  console.log("Students data from redux:", list);
  const studentCount = loading ? "Loading..." : list.length;
  // Log count only after loading is done
  useEffect(() => {
    if (!loading) {
      console.log("Student count:", list.length);
    }
  }, [loading, list]);

  const students = Array.isArray(list) && !loading ? list : [];


  return (
    <div className="table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className={index % 2 === 1 ? "striped" : ""}>
              <td >{student.id}</td>
              <td>{student.firstname} {student.lastname}</td> {/* combine first + last */}
              <td>{student.email}</td>
              <td>{student.course || "N/A"}</td>
              <td>{student.status || "N/A"}</td>
              <td className="action-buttons">
                <button className="progress-btn">View Progress</button>
                <button className="delete-btn">
                  <FaTrash />
                </button>
                <button className="edit-btn">
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManage;
