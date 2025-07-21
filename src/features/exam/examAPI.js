// src/api/examApi.js
export const postQuestion = async (questionData) => {
    try {
        const response = await fetch("https://lunarsenterprises.com:6040/davidsacademy/exam/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(questionData)
        });

        if (!response.ok) {
            throw new Error("Failed to post question");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
// src/api/questionTypeApi.js
export const fetchQuestionTypes = async () => {
    try {
        const response = await fetch("https://lunarsenterprises.com:6040/davidsacademy/exam/list/question-types"); // replace with real URL

        if (!response.ok) {
            throw new Error("Failed to fetch question types");
        }

        const data = await response.json();
        return data.list; // ✅ return only the list array
    } catch (error) {
        throw error;
    }
};
