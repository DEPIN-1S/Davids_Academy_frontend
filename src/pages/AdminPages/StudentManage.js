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
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch students whenever page, search, or filter changes
  useEffect(() => {
    dispatch(fetchStudents({ page, limit: 10, searchQuery, filterStatus }));
  }, [dispatch, page, searchQuery, filterStatus]);

  const handleDelete = (studentId) => {
    if (window.confirm("Do you really want to update this student's status?")) {
      dispatch(removeStudent(studentId))
        .unwrap()
        .then(() => {
          alert("Student status updated successfully ✅");
          dispatch(fetchStudents({ page, limit: 10, searchQuery, filterStatus }));
        })
        .catch((error) => {
          alert(error.message || "Error updating student status");
        });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const navigate = useNavigate();
  const navigateToViewProgress = (studentId) => {
    navigate(`/admin/view-progress/${studentId}`);
  };

  // ✅ No frontend filtering anymore, just take list directly from backend
  const students = !loading && Array.isArray(list) ? list : [];

  return (
    <>
      <div className="table-header">
        <h3>Total Students: {total || 0}</h3>
        <div className="controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => {
              setPage(1); // reset to first page on search
              setSearchQuery(e.target.value);
            }}
          />
          <select
            className="status-dropdown"
            value={filterStatus}
            onChange={(e) => {
              setPage(1); // reset to first page on filter
              setFilterStatus(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="add-student" onClick={() => setShowAddForm(true)}>
            + Add Student
          </button>
        </div>
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
                <tr
                  key={student.id || index}
                  className={index % 2 === 1 ? "striped" : ""}
                >
                  <td>{student.id}</td>
                  <td>{student.firstname} {student.lastname}</td>
                  <td>{student.email}</td>
                  <td>{student.cs_name || "N/A"}</td>
                  <td>{student.status || "N/A"}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => navigateToViewProgress(student.id)}
                      className="progress-btn"
                    >
                      View Progress
                    </button>

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
        {/* ✅ Pagination controls — shown only if there are students */}
        {students.length > 0 && (
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
        )}


        {/* Edit Student Modal */}
        {selectedStudentId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <EditStudentForm
                studentId={selectedStudentId}

                onClose={() => {
                  setSelectedStudentId(null); // close modal
                  dispatch(fetchStudents({ page, limit: 10, searchQuery, filterStatus }));
                }}
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
                  dispatch(fetchStudents({ page, limit: 10, searchQuery, filterStatus }));
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
