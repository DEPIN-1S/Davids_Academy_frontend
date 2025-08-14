// src/api/examApi.js
const baseUrl = process.env.REACT_APP_API_URL;

console.log(baseUrl);
export const postQuestion = async (questionData) => {
    try {
        console.log("inside submit question apiiii");
        console.log("🚀 API request started:", questionData);
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

        return await response.json();
    } catch (error) {
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
        console.log(baseUrl + "/exam/list/question-types");
        const data = await response.json();
        return data.list; // ✅ return only the list array
    } catch (error) {
        throw error;
    }
};
