import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AdminStyles/ViewProgress.css";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchStudentProgress } from "../features/students/studentSlice";
import { useDispatch, useSelector } from "react-redux";

function ViewProgress() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tests, error } = useSelector((state) => state.students);

    useEffect(() => {
        if (studentId) dispatch(fetchStudentProgress(studentId));
    }, [dispatch, studentId]);

    // Log tests whenever they change
    useEffect(() => {
        console.log("Redux tests state:", tests);
    }, [tests]);

    return (
        <>
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Test Title</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Started At</th>
                            <th>Updated At</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.length > 0 ? (
                            tests.map((test) => (
                                <tr key={test.st_id}>
                                    <td>{test.testTitle}</td>
                                    <td>{new Date(test.fromDate).toLocaleDateString()}</td>
                                    <td>{new Date(test.toDate).toLocaleDateString()}</td>
                                    <td>
                                        {new Date(test.st_created_at).toLocaleTimeString("en-IN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                            timeZone: "Asia/Kolkata",
                                        })}
                                    </td>
                                    <td>
                                        {new Date(test.st_updated_at).toLocaleTimeString("en-IN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                            timeZone: "Asia/Kolkata",
                                        })}
                                    </td>
                                    <td>{test.st_score}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} style={{ textAlign: "center" }}>
                                    No test progress available
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {error && (
                <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Back To Student Management
                </Button>
            </Box>
        </>
    );
}

export default ViewProgress;
