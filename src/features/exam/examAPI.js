// src/api/examApi.js
const baseUrl = process.env.REACT_APP_API_URL;
export const postQuestion = async (questionData) => {
    console.log("question data in api call :::::",questionData);
    
    try {
        const response = await fetch(baseUrl + "/exam/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(questionData)
        });

        if (!response.ok) {
            throw new Error("Failed to post question");
        }

        const result = await response.json(); // ✅ store result

        if (result?.message) {
            console.log("✅ API Response Message:", result.message);
        }

        return result; // ✅ return after logging
    } catch (error) {
        console.error("❌ API Error:", error);
        throw error;
    }
};



// src/api/questionTypeApi.js
export const fetchQuestionTypes = async () => {
    try {
        const response = await fetch(baseUrl + "/exam/list/question-types"); // replace with real URL

        if (!response.ok) {
            throw new Error("Failed to fetch question types");
        }
        const data = await response.json();
        return data.list; // ✅ return only the list array
    } catch (error) {
        throw error;
    }
};
// list question as per type
export const fetchMockTestQuestion = async () => {
    try {
        const response = await fetch(baseUrl + "/exam/list/questions/mocktest");

        if (!response.ok) {
            throw new Error("Failed to fetch question types");
        }
        const data = await response.json();
        return data.list; // ✅ return only the list array
    } catch (error) {
        throw error;
    }
};
// POST: Create a new test with all necessary details
export const postTest = async (testData) => {
    console.log('Test data', testData)
    try {
        const response = await fetch(`${baseUrl}/exam/tests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
        });

        if (!response.ok) {
            throw new Error("Failed to create test");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
