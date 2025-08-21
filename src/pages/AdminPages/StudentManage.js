import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaToggleOff, FaToggleOn } from "react-icons/fa";
import "../../styles/AdminStyles/StudentManage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, removeStudent } from "../../features/students/studentSlice";
import AddStudentForm from "../../components/AdminComponents/AddStudentForm";
import EditStudentForm from "../../components/AdminComponents/EditStudentForm";

const StudentManage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.students);

  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null); // ✅ holds studentId being edited

  // Filter logic
  const filteredStudents = list.filter((student) => {
    if (filterStatus === "all") return true;
    return student.status?.toLowerCase() === filterStatus;
  });

  const handleDelete = (studentId) => {
    if (window.confirm("Do you really want to update this student's status?")) {
      dispatch(removeStudent(studentId))
        .unwrap()
        .then(() => {
          alert("Student status updated successfully ✅");
          dispatch(fetchStudents());
        })
        .catch((error) => {
          alert(error.message || "Error updating student status");
        });
    }
  };

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      console.log("Student count:", list.length);
      console.log("students in student manage :::: ",list);
      
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

        <button className="add-student" onClick={() => setShowAddForm(true)}>
          + Add Student
        </button>
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
                <td>{student.cs_name || "N/A"}</td>
                <td>{student.status || "N/A"}</td>
                <td className="action-buttons">
                  <button className="progress-btn">View Progress</button>

                  {student.status === "active" ? (
                    <button
                      className="active-btn"
                      onClick={() => handleDelete(student.id)}
                    >
                      <FaToggleOn className="text-green-500" size={20} />
                    </button>
                  ) : (
                    <button
                      className="inactive-btn"
                      onClick={() => handleDelete(student.id)}
                    >
                      <FaToggleOff className="text-gray-500" size={20} />
                    </button>
                  )}

                  {/* ✅ Pass studentId here */}
                  <button
                    className="edit-btn"
                    onClick={() => setSelectedStudentId(student.id)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Student Modal */}
        {selectedStudentId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <EditStudentForm
                studentId={selectedStudentId}
                onClose={() => setSelectedStudentId(null)} // close on cancel/save
              />
            </div>
          </div>
        )}

        {/* Add Student Modal */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AddStudentForm
                onClose={() => setShowAddForm(false)}
                onSuccess={() => {
                  dispatch(fetchStudents());
                  setShowAddForm(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentManage;

