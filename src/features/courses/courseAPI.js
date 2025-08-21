// src/api/courseApi.js

const baseUrl = process.env.REACT_APP_API_URL;

// ADD COURSE (POST, FormData)
export const addCourse = async (courseData) => {
    try {
        // courseData must be a FormData instance!
        console.log("Cousrse data in api call",courseData);
        
        const response = await fetch(baseUrl + "/course/create/course", {
            method: "POST",
            body: courseData, // will be sent as multipart/form-data
            // DO NOT set Content-Type! Browser will set it with boundary.
        });

        // Handle HTTP errors
        if (!response.ok) {
            let errorText;
            // Try to parse error JSON with detailed message, if possible
            try {
                const errRes = await response.json();
                errorText =
                    errRes?.message ||
                    errRes?.error ||
                    JSON.stringify(errRes) ||
                    "Failed to add course";
                    console.log("Error text:::",errorText);
                    
            } catch {
                errorText = response.statusText || "Failed to add course";
                console.log("Errortext::::",errorText);
                
            }
            throw new Error(errorText);
        }

        // Return the parsed response
        return await response.json();
    } catch (error) {
        // Should always throw the actual error instance (not just a string!)
        throw error;
    }
};

// LIST COURSES (all) (GET)
export const listCourses = async () => {
    console.log("list courses in api call ");
    
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
            method: "POST",
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
