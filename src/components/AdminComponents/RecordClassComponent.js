import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../../styles/AdminStyles/RecordClassInfoComponent.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addRecording } from "../../features/recorded classes/recordedClassSlice"
const RecordedClassInfoComponent = ({ onNext, onBack }) => {
    const [formData, setFormData] = useState({
        classTitle: '',
        classDuration: '',
        tutorName: '',
        videoUrl: ''
    });
    const [errors, setErrors] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.classTitle.trim()) {
            newErrors.classTitle = 'Class title is required';
        }
        if (!formData.classDuration.trim()) {
            newErrors.classDuration = 'Class duration is required';
        }
        if (!formData.tutorName.trim()) {
            newErrors.tutorName = 'Tutor name is required';
        }
        if (!formData.videoUrl.trim()) {
            newErrors.videoUrl = 'Video url is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const handleNext = () => {
        if (validateForm()) {
            dispatch(addRecording(formData))
                .unwrap()
                .then((res) => {
                    console.log("Recording added successfully:", res);

                    // show success message
                    alert("Recorded class added successfully!");
                   
                    // navigate to listing page
                    navigate('/admin/recorded-class');
                })
                .catch((err) => {
                    console.error("Failed to create recording:", err);
                    alert("Failed to add recorded class. Please try again.");
                });
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <div className="recorded-class-info-page">
            {/* Page Header */}
            <div className="class-info-header">
                <div className="header-content">
                    <div className="breadcrumb">
                        <span className="breadcrumb-item">Attach Recorded Video</span>
                        <span className="breadcrumb-separator">›</span>
                        <span className="breadcrumb-item">Thumbnail Upload</span>
                        <span className="breadcrumb-separator">›</span>
                        <span className="breadcrumb-item active">Class Information</span>
                    </div>
                    <h1 className="page-title">Add Recorded Class Information</h1>
                </div>
            </div>

            {/* Content Area */}
            <div className="class-info-content">
                <div className="form-container">
                    <form className="class-info-form">
                        {/* Class Title */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="classTitle">
                                Class Title
                            </label>
                            <input
                                id="classTitle"
                                name="classTitle"
                                type="text"
                                className={`form-input ${errors.classTitle ? 'error' : ''}`}
                                placeholder="Enter a clear and descriptive title for the class."
                                value={formData.classTitle}
                                onChange={handleInputChange}
                            />
                            {errors.classTitle && (
                                <span className="error-message">{errors.classTitle}</span>
                            )}
                        </div>

                        {/* Class Duration */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="classDuration">
                                Class Duration
                            </label>
                            <input
                                id="classDuration"
                                name="classDuration"
                                type="text"
                                className={`form-input ${errors.classDuration ? 'error' : ''}`}
                                placeholder="Specify the total time length of the recorded session."
                                value={formData.classDuration}
                                onChange={handleInputChange}
                            />
                            {errors.classDuration && (
                                <span className="error-message">{errors.classDuration}</span>
                            )}
                        </div>

                        {/* Tutor Name */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="tutorName">
                                Tutor Name
                            </label>
                            <input
                                id="tutorName"
                                name="tutorName"
                                type="text"
                                className={`form-input ${errors.tutorName ? 'error' : ''}`}
                                placeholder="Choose from the list or manually enter the tutor's name."
                                value={formData.tutorName}
                                onChange={handleInputChange}
                            />
                            {errors.tutorName && (
                                <span className="error-message">{errors.tutorName}</span>
                            )}
                        </div>


                        {/* Video Name */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="videoUrl">
                                Video URL
                            </label>
                            <input
                                id="videoUrl"
                                name="videoUrl"
                                type="text"
                                className={`form-input ${errors.videoUrl ? 'error' : ''}`}
                                placeholder="Add the video url."
                                value={formData.videoUrl}
                                onChange={handleInputChange}
                            />
                            {errors.tutorName && (
                                <span className="error-message">{errors.videoUrl}</span>
                            )}
                        </div>
                    </form>

                    {/* Navigation Buttons */}
                    <div className="navigation-buttons">
                        <button
                            className="nav-btn back-btn"
                            onClick={handleBack}
                            type="button"
                        >
                            <FaArrowLeft className="btn-icon" />
                            <span className="btn-text">Back</span>
                        </button>

                        <button
                            className="nav-btn next-btn"
                            onClick={handleNext}
                            type="button"
                        >
                            <span className="btn-text">Submit</span>
                            <FaArrowRight className="btn-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordedClassInfoComponent;
