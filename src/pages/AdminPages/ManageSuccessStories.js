import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/AdminStyles/SuccessStories.css";
import {
  addSuccessStory,
  deleteSuccessStory,
  fetchSuccessStories,
} from "../../features/exam/examSlice";
import {
  successStoryImageFallback,
  successStoryImageSrc,
} from "../../config/media";

function ManageSuccessStories() {
  const dispatch = useDispatch();

  const {
    addSuccessStoryLoading,
    addSuccessStoryError,
    addSuccessStoryResult,
    
    successStories,
  } = useSelector((state) => state.exam);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const handleDeleteStory = async (id) => {
    if (window.confirm("Are you sure you want to delete this success story?")) {
      const result = await dispatch(deleteSuccessStory(id));

      // 🧩 Log the full response from Redux Thunk
      console.log(" Delete Story Response:", result);

      if (result.meta.requestStatus === "fulfilled") {
        console.log("✅ Story deleted successfully:", result.payload);
        alert("Story deleted successfully!");
        dispatch(fetchSuccessStories()); // refresh after delete
      } else {
        console.error("❌ Failed to delete story:", result.error);
        alert("Failed to delete story. Please try again.");
      }
    }
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const uploadSuccessStoryHandler = async () => {
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedImage);
    await dispatch(addSuccessStory(formData));
  };

  // Fetch stories on mount
  useEffect(() => {
    dispatch(fetchSuccessStories());
  }, [dispatch]);

  // Handle upload result
  useEffect(() => {
    if (addSuccessStoryResult) {
      alert("Success story uploaded!");
      dispatch(fetchSuccessStories());
      handleCloseModal();
    }
    if (addSuccessStoryError) {
      alert("Failed to upload: " + addSuccessStoryError);
    }
  }, [addSuccessStoryResult, addSuccessStoryError, dispatch]);

  console.log("✅ Success Stories Data:", successStories);

  return (
    <div className="success-stories-container success-stories-futuristic">
      <button className="add-success-story-btn" onClick={handleOpenModal}>
        + Add Success Story
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Success Story</h3>
            <label className="drag-drop-area">
              {selectedImage ? "Change Image" : "Click or Drag to Upload"}
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="image-preview"
                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
              />
            )}

            <div className="modal-actions">
              <button
                onClick={handleCloseModal}
                className="close-btn"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={uploadSuccessStoryHandler}
                className="upload-btn"
                type="button"
                disabled={addSuccessStoryLoading}
              >
                {addSuccessStoryLoading ? "Uploading..." : "Upload Story"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Stories Grid */}
      <div className="success-stories-grid">
        {successStories && successStories.length > 0 ? (
          successStories.map((story, index) => (
            <div
              className="success-story-card"
              key={story.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                src={successStoryImageSrc(story)}
                alt={`Success Story ${story.id}`}
                className="story-image"
                onError={(event) => {
                  const fallback = successStoryImageFallback(story);
                  const currentSrc = event.target.currentSrc || event.target.src;
                  if (
                    fallback &&
                    event.target.dataset.fallback !== "1" &&
                    currentSrc !== fallback
                  ) {
                    event.target.dataset.fallback = "1";
                    event.target.src = fallback;
                    return;
                  }
                  event.target.closest(".success-story-card")?.remove();
                }}
              />
              <button
                onClick={() => handleDeleteStory(story.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No success stories available.</p>
        )}
      </div>
    </div>
  );
}

export default ManageSuccessStories;
