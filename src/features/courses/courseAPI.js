// src/api/courseApi.js

const baseUrl = process.env.REACT_APP_API_URL;

// ADD COURSE (POST, FormData)
export const addCourse = async (courseData) => {
    try {
        // courseData must be a FormData instance, not JSON!
        const response = await fetch(baseUrl + "/exam/course/create/course", {
            method: "POST",
            body: courseData
            // NOTE: Do NOT set 'Content-Type' header for FormData!
        });

        if (!response.ok) {
            throw new Error("Failed to add course");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// LIST COURSES (all) (GET)
export const listCourses = async () => {
    try {
        const response = await fetch(baseUrl + "/course/list/courses", {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to list courses");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// LIST COURSES BY CS_ID (GET)
export const listCoursesByCsId = async (cs_id) => {
    try {
        const response = await fetch(baseUrl + `/course/list/courses?cs_id=${cs_id}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to list courses by cs_id");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// EDIT/UPDATE COURSE (PUT, FormData - must include course ID in formdata)
export const updateCourse = async (formData) => {
    try {
        const response = await fetch(baseUrl + "/course/update/course", {
            method: "PUT",
            body: formData
            // Don't set Content-Type for FormData
        });

        if (!response.ok) {
            throw new Error("Failed to update course");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// DELETE COURSE (DELETE, pass course id in URL)
export const deleteCourse = async (id) => {
    try {
        const response = await fetch(baseUrl + `/course/delete/course/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete course");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
