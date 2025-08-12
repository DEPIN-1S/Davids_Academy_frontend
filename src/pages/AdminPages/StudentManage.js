import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../../styles/AdminStyles/StudentManage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../../features/students/studentSlice";
import AddStudentForm from "../../components/AdminComponents/AddStudentForm";

const StudentManage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.students);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter logic
  const filteredStudents = list.filter((student) => {
    if (filterStatus === "all") return true;
    return student.status?.toLowerCase() === filterStatus;
  });

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      console.log("Student count:", list.length);
    }
  }, [loading, list]);

  const students = Array.isArray(filteredStudents) && !loading ? filteredStudents : [];

  return (
    <>
      <div className="table-header">
        <select
          className="status-dropdown"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="add-student" onClick={() => setShowAddForm(true)} >+ Add Student</button>
      </div>

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
                <td>{student.id}</td>
                <td>{student.firstname} {student.lastname}</td>
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

        {/* Add Student Modal */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AddStudentForm onClose={() => setShowAddForm(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentManage;
