// src/api/examApi.js
const baseUrl = process.env.REACT_APP_API_URL;
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

export const postQuestion = async (questionData) => {
    console.log("question data in api call :::::", questionData);
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
        console.log("result response from api call ::::", result);

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

//for fetching test questions
export async function fetchTestQuestionsAPI() {
    console.log("Inside fetch test questions :::: ");

    /*  const response = await fetch(
         "https://lunarsenterprises.com:6040/davidsacademy/student/test/list",
         {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
             },
         }
     );
     if (!response.ok) {
         throw new Error("Failed to fetch test questions");
     }
     return response.json(); // expects JSON array */
}



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
export const fetchQBankQuestions = async () => {
    try {
        const response = await fetch(
            process.env.REACT_APP_API_URL + "/student/questions/list",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch Q-Bank questions");
        }
        const data = await response.json();
        // Response: { result: true, message: "...", data: [...] }
        return data.data; // Return the array of question IDs
    } catch (error) {
        throw error;
    }
};

export const fetchQBankQuestionData = async (questionId) => {
    try {
        const response = await fetch(
            process.env.REACT_APP_API_URL + "/student/questions/data",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`

                },
                body: JSON.stringify({ questionId: questionId })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch Q-Bank question data");
        }

        const data = await response.json();

        // The question data is under data.data as per your example
        return data.data;
    } catch (error) {
        throw error;
    }
};


// ✅ Fetch Question Bank Test Questions in admin side
export const adminGetQBankQuestions = async (page = 1, limit = 10) => {
    try {
        const url = `${baseUrl}/exam/list/questions/${page}?exam_type=q-bank&limit=${limit}`;
        console.log("Fetching URL:", url);

        const response = await fetch(url, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Q-Bank questions");
        }

        const result = await response.json();
        console.log("✅ Get Question Bank Question ::: ", result);

        return result;
    } catch (error) {
        console.error("❌ Q-Bank API Error:", error);
        throw error;
    }
};


// ✅ Fetch Mock Test Questions in admin side
export const adminGetMockTestQuestions = async (page = 1, limit = 10) => {
    try {
        const url = `${baseUrl}/exam/list/questions/${page}?exam_type=mock test&limit=${limit}`;
        console.log("Fetching URL:", url);

        const response = await fetch(url, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Mock Test questions");
        }

        const result = await response.json();
        console.log("✅ Get Mock Test Questions ::: ", result);

        return result;
    } catch (error) {
        console.error("❌ Mock Test API Error:", error);
        throw error;
    }
};



// fetch test questions in admin side
export async function adminGetTestQuestions(page = 1) {
    try {
        const response = await fetch(
            `https://lunarsenterprises.com:6040/davidsacademy/exam/list/test/${page}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch test questions: ${response.status}`);
        }

        const data = await response.json();
        return data; // full response
    } catch (error) {
        console.error("admin Test API Error:", error);
        throw error;
    }
}



