import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaImage, FaTimes } from "react-icons/fa";
import "../../styles/AdminStyles/RecordClassInfoComponent.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordedClasses, updateRecording } from "../../features/recorded classes/recordedClassSlice";
import { fetchCourses } from "../../features/courses/courseSlice";

const EditRecordedClassComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const { list: courses } = useSelector((state) => state.course);
    const { list: recordings, loading } = useSelector((state) => state.recordings);

    const [formData, setFormData] = useState({
        classTitle: "",
        classDuration: "",
        tutorName: "",
        courseId: "",
        videoUrl: "",
        recordDate: "",
        recordimage: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);

    // Fetch courses and all recordings on mount
    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        dispatch(fetchCourses());
        if (token) {
            dispatch(fetchRecordedClasses({ token, page: 1, limit: 100 }));
        }
    }, [dispatch]);

    // Pre-fill form once recordings are loaded
    useEffect(() => {
        if (!dataLoaded && recordings && recordings.length > 0) {
            const parsedId = parseInt(id, 10);
            const recording = recordings.find(
                (r) => r.r_id === parsedId || r.r_id === id
            );
            if (recording) {
                let dateStr = "";
                if (recording.r_record_date) {
                    const dateObj = new Date(recording.r_record_date);
                    if (!isNaN(dateObj)) {
                        dateStr = dateObj.toISOString().split("T")[0];
                    }
                }
                setFormData({
                    classTitle: recording.r_title || "",
                    classDuration: recording.r_duration || "",
                    tutorName: recording.r_tutor_name || "",
                    courseId: recording.r_course || "",
                    videoUrl: recording.r_video_url || "",
                    recordDate: dateStr,
                    recordimage: null,
                });
                if (recording.r_thumbnail) {
                    const apiBase = process.env.REACT_APP_API_URL
                        ? process.env.REACT_APP_API_URL.replace("/davidsacademy", "")
                        : "";
                    setPreviewImage(`${apiBase}/${recording.r_thumbnail}`);
                }
                setDataLoaded(true);
            }
        }
    }, [id, recordings, dataLoaded]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, recordimage: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveNewImage = () => {
        setFormData((prev) => ({ ...prev, recordimage: null }));
        const parsedId = parseInt(id, 10);
        const recording = recordings.find((r) => r.r_id === parsedId || r.r_id === id);
        if (recording && recording.r_thumbnail) {
            const apiBase = process.env.REACT_APP_API_URL
                ? process.env.REACT_APP_API_URL.replace("/davidsacademy", "")
                : "";
            setPreviewImage(`${apiBase}/${recording.r_thumbnail}`);
        } else {
            setPreviewImage(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.classTitle.trim()) newErrors.classTitle = "Class title is required";
        if (!formData.classDuration.trim()) newErrors.classDuration = "Class duration is required";
        if (!formData.recordDate.trim()) newErrors.recordDate = "Class date is required";
        if (!String(formData.courseId).trim()) newErrors.courseId = "Course selection is required";
        if (!formData.tutorName.trim()) newErrors.tutorName = "Tutor name is required";
        if (!formData.videoUrl.trim()) newErrors.videoUrl = "Video URL is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = () => {
        if (!validateForm()) return;
        const updateData = { recording_id: id, ...formData };
        dispatch(updateRecording(updateData))
            .unwrap()
            .then(() => {
                const token = sessionStorage.getItem("accessToken");
                dispatch(fetchRecordedClasses({ token, page: 1, limit: 10 }));
                alert("Recorded class updated successfully!");
                navigate("/admin/recorded-class");
            })
            .catch((err) => {
                console.error("Update failed:", err);
                alert("Failed to update recorded class. Please try again.");
            });
    };

    if (loading && !dataLoaded) {
        return <p style={{ padding: "2rem" }}>Loading recording data...</p>;
    }

    return (
        <div className="recorded-class-info-page">
            <div className="class-info-header">
                <div className="header-content">
                    <h1 className="page-title">Edit Recorded Class</h1>
                </div>
            </div>

            <div className="class-info-content">
                <div className="form-container">
                    <form className="class-info-form">

                        {/* Thumbnail */}
                        <div className="form-group">
                            <label className="form-label" style={{ display: "block", marginBottom: "10px" }}>
                                Thumbnail Image (leave blank to keep existing)
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                                {previewImage ? (
                                    <div style={{ position: "relative", width: "200px", height: "120px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
                                        <img
                                            src={previewImage}
                                            alt="Thumbnail Preview"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        {formData.recordimage && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveNewImage}
                                                style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(220,53,69,0.85)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ width: "200px", height: "120px", borderRadius: "8px", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", color: "#aaa" }}>
                                        <FaImage size={32} />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                >
                                    Choose New Image
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>

                        {/* Class Title */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="classTitle">Class Title</label>
                            <input
                                id="classTitle"
                                name="classTitle"
                                type="text"
                                className={`form-input ${errors.classTitle ? "error" : ""}`}
                                placeholder="Enter class title"
                                value={formData.classTitle}
                                onChange={handleInputChange}
                            />
                            {errors.classTitle && <span className="error-message">{errors.classTitle}</span>}
                        </div>

                        <div className="duration-date">
                            {/* Duration */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="classDuration">Class Duration</label>
                                <input
                                    id="classDuration"
                                    name="classDuration"
                                    type="text"
                                    className={`form-input ${errors.classDuration ? "error" : ""}`}
                                    placeholder="Total class duration"
                                    value={formData.classDuration}
                                    onChange={handleInputChange}
                                />
                                {errors.classDuration && <span className="error-message">{errors.classDuration}</span>}
                            </div>

                            {/* Date */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="recordDate">Class Date</label>
                                <input
                                    id="recordDate"
                                    name="recordDate"
                                    type="date"
                                    className={`form-input ${errors.recordDate ? "error" : ""}`}
                                    value={formData.recordDate}
                                    onChange={handleInputChange}
                                />
                                {errors.recordDate && <span className="error-message">{errors.recordDate}</span>}
                            </div>

                            {/* Course */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="courseId">Course Name</label>
                                <select
                                    id="courseId"
                                    name="courseId"
                                    className={`form-input ${errors.courseId ? "error" : ""}`}
                                    value={formData.courseId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Course Name</option>
                                    {courses && courses.map((course) => (
                                        <option key={course.cs_id} value={course.cs_id}>
                                            {course.cs_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.courseId && <span className="error-message">{errors.courseId}</span>}
                            </div>
                        </div>

                        {/* Tutor */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="tutorName">Tutor Name</label>
                            <input
                                id="tutorName"
                                name="tutorName"
                                type="text"
                                className={`form-input ${errors.tutorName ? "error" : ""}`}
                                placeholder="Enter the tutor's name"
                                value={formData.tutorName}
                                onChange={handleInputChange}
                            />
                            {errors.tutorName && <span className="error-message">{errors.tutorName}</span>}
                        </div>

                        {/* Video URL */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="videoUrl">Video URL</label>
                            <input
                                id="videoUrl"
                                name="videoUrl"
                                type="text"
                                className={`form-input ${errors.videoUrl ? "error" : ""}`}
                                placeholder="Add the video URL"
                                value={formData.videoUrl}
                                onChange={handleInputChange}
                            />
                            {errors.videoUrl && <span className="error-message">{errors.videoUrl}</span>}
                        </div>
                    </form>

                    <div className="navigation-buttons">
                        <button className="nav-btn back-btn" onClick={() => navigate("/admin/recorded-class")} type="button">
                            <FaArrowLeft className="btn-icon" />
                            <span className="btn-text">Back</span>
                        </button>
                        <button className="nav-btn next-btn" onClick={handleUpdate} type="button">
                            <span className="btn-text">Update</span>
                            <FaArrowRight className="btn-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRecordedClassComponent;
