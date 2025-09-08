import React, { useEffect, useState } from "react";
import { FaEdit, FaToggleOff, FaToggleOn } from "react-icons/fa";
import "../../styles/AdminStyles/StudentManage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, removeStudent } from "../../features/students/studentSlice";
import AddStudentForm from "../../components/AdminComponents/AddStudentForm";
import EditStudentForm from "../../components/AdminComponents/EditStudentForm";
import { useNavigate } from "react-router-dom";

const StudentManage = () => {
  const dispatch = useDispatch();
  const { list, loading, totalPages, currentPage, total } = useSelector(
    (state) => state.students
  );

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Fetch students whenever page changes
  useEffect(() => {
    dispatch(fetchStudents({ page, limit: 10 }));
    console.log("Students list from Redux:", list)

  }, [dispatch, page]);

  // Filter logic
  const filteredStudents = Array.isArray(list)
    ? list.filter((student) =>
      filterStatus === "all"
        ? true
        : student.status?.toLowerCase() === filterStatus
    )
    : [];

  const handleDelete = (studentId) => {
    if (window.confirm("Do you really want to update this student's status?")) {
      dispatch(removeStudent(studentId))
        .unwrap()
        .then(() => {
          alert("Student status updated successfully ✅");
          dispatch(fetchStudents({ page, limit: 10 }));
        })
        .catch((error) => {
          alert(error.message || "Error updating student status");
        });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const navigate = useNavigate()
  const navigateToViewProgress = (studentId) => {
    navigate(`/admin/view-progress/${studentId}`);
  };
  const students = !loading ? filteredStudents : [];

  return (
    <>
      <div className="table-header">
        <h3>Total Students: {total || 0}</h3>
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
            {!loading && students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id || index} className={index % 2 === 1 ? "striped" : ""}>
                  <td>{student.id}</td>
                  <td>{student.firstname} {student.lastname}</td>
                  <td>{student.email}</td>
                  <td>{student.cs_name || "N/A"}</td>
                  <td>{student.status || "N/A"}</td>
                  <td className="action-buttons">
                    <button onClick={() => navigateToViewProgress(student.id)} className="progress-btn">View Progress</button>

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

                    <button
                      className="edit-btn"
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  {loading ? "Loading students..." : "No students found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination controls */}
        <div className="pagination-controls">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage || 1} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>

        {/* Edit Student Modal */}
        {selectedStudentId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <EditStudentForm
                studentId={selectedStudentId}
                onClose={() => setSelectedStudentId(null)}
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
                  dispatch(fetchStudents({ page, limit: 10 }));
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
