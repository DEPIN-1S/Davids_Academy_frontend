import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../../../styles/AdminStyles/StudentManage.css";

const StudentManage = () => {
  const students = [
    {
      id: "00125",
      name: "Aisha Khan",
      email: "aisha@email.com",
      course: "DHA",
      password: "123@pass",
      status: "Active",
    },
    {
      id: "00125",
      name: "Aisha Khan",
      email: "aisha@email.com",
      course: "DHA",
      password: "123@pass",
      status: "Active",
    },
    {
      id: "00125",
      name: "Aisha Khan",
      email: "aisha@email.com",
      course: "DHA",
      password: "123@pass",
      status: "Active",
    },
    {
      id: "00125",
      name: "Aisha Khan",
      email: "aisha@email.com",
      course: "DHA",
      password: "123@pass",
      status: "Active",
    },
    {
      id: "00125",
      name: "Aisha Khan",
      email: "aisha@email.com",
      course: "DHA",
      password: "123@pass",
      status: "Active",
    },
  ];

  return (
    <div className="table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Password</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className={index % 2 === 1 ? "striped" : ""}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>{student.password}</td>
              <td>{student.status}</td>
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
