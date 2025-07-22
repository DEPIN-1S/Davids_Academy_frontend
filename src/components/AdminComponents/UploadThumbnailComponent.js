import React, { useState, useRef } from "react";
import { FaUpload, FaTimes, FaImage, FaCheck } from "react-icons/fa";
import "../../styles/AdminStyles/UploadThumbnailComponent.css";

const UploadThumbnailComponent = ({ onUpload, onNext, onBack }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setUploadedFile(file);
            simulateUpload(file);
        } else {
            alert('Please select a valid image file');
        }
    };

    // Simulate file upload progress
    const simulateUpload = (file) => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    if (onUpload) {
                        onUpload(file);
                    }
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Open file browser
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    // Remove uploaded file
    const handleRemoveFile = () => {
        setUploadedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Get file preview URL
    const getFilePreview = (file) => {
        if (file) {
            return URL.createObjectURL(file);
        }
        return null;
    };

    return (
        <div className="upload-thumbnail-container">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <span className="breadcrumb-item">Attach Recorded Video</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-item active">Thumbnail Upload</span>
            </div>

            {/* Header */}
            <div className="upload-header">
                <h1 className="upload-title">Thumbnail Upload</h1>
                <p className="upload-subtitle">
                    Upload a cover image for your recorded session.
                </p>
            </div>

            {/* Upload Area */}
            <div className="upload-content">
                {!uploadedFile ? (
                    <div
                        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon">
                            <FaImage />
                        </div>

                        <div className="upload-text">
                            <p className="drag-text">Drag and drop image file</p>
                            <p className="or-text">or</p>
                        </div>

                        <button
                            className="browse-btn"
                            onClick={handleBrowseClick}
                            type="button"
                        >
                            Browse
                        </button>

                        <p className="upload-hint">
                            Supported formats: JPG, PNG, GIF (Max 5MB)
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="file-input"
                            hidden
                        />
                    </div>
                ) : (
                    <div className="upload-preview">
                        <div className="preview-header">
                            <h3>Selected Thumbnail</h3>
                            <button
                                className="remove-btn"
                                onClick={handleRemoveFile}
                                type="button"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="preview-container">
                            <img
                                src={getFilePreview(uploadedFile)}
                                alt="Thumbnail preview"
                                className="preview-image"
                            />

                            {isUploading && (
                                <div className="upload-overlay">
                                    <div className="progress-circle">
                                        <div className="progress-text">{uploadProgress}%</div>
                                    </div>
                                </div>
                            )}

                            {uploadProgress === 100 && !isUploading && (
                                <div className="success-overlay">
                                    <FaCheck className="success-icon" />
                                </div>
                            )}
                        </div>

                        <div className="file-info">
                            <p className="file-name">{uploadedFile.name}</p>
                            <p className="file-size">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>

                        {isUploading && (
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
                <button
                    className="nav-btn back-btn"
                    onClick={onBack}
                    type="button"
                >
                    ← Back
                </button>

                <button
                    className={`nav-btn next-btn ${!uploadedFile || isUploading ? 'disabled' : ''}`}
                    onClick={onNext}
                    disabled={!uploadedFile || isUploading}
                    type="button"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default UploadThumbnailComponent;
