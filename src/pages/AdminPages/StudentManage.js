import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../../styles/AdminStyles/StudentManage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../../features/students/studentSlice";
import AddStudentForm from "../../components/AdminComponents/AddStudentForm";
import { removeStudent } from "../../features/students/studentSlice";
import EditStudentForm from "../../components/AdminComponents/EditStudentForm"
import { FaToggleOff } from "react-icons/fa";
import { FaToggleOn } from "react-icons/fa";

const StudentManage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.students);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false)

  // Filter logic
  const filteredStudents = list.filter((student) => {
    if (filterStatus === "all") return true;
    return student.status?.toLowerCase() === filterStatus;
  });


  /* const handleDelete = (studentId) => {
    if (window.confirm("Do you really want to update this student's status?")) {
      dispatch(removeStudent(studentId))
        .unwrap()
        .then(() => {
          console.log("Student status updated successfully");
          dispatch(fetchStudents());
        })
        .catch((error) => {
          console.error("Failed to update student status:", error);
          alert("Error updating student status");
        });
    }
  }; */


  const handleDelete = (studentId) => {
    if (window.confirm("Do you really want to update this student's status?")) {
      dispatch(removeStudent(studentId))
        .unwrap()
        .then(() => {
          alert("Student status updated successfully ✅");
          dispatch(fetchStudents()); // optional if your state is already updated
        })
        .catch((error) => {
          alert(error.message || "Error updating student status");
        });
    }
  };




  useEffect(() => {
    dispatch(fetchStudents());
    console.log(students);

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
                  {/* <button className="delete-btn" onClick={() => handleDelete(student.id)} >
                    <FaToggleOff />
                  </button> */}
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
                  <button className="edit-btn" onClick={() => setShowEditForm(true)} >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {
          showEditForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <EditStudentForm onClose={() => setShowEditForm(false)} />
              </div>
            </div>
          )
        }


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
