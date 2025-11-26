// src/api/examApi.js
const baseUrl = process.env.REACT_APP_API_URL;
const accessToken = sessionStorage.getItem("accessToken");
const refreshToken = sessionStorage.getItem("refreshToken");

const getToken = () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }
  return token;
};

export const postQuestion = async (questionData) => {
  console.log("question data in api call :::::", questionData);
  const token = sessionStorage.getItem("accessToken");
  try {
    const response = await fetch(baseUrl + "/exam/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(questionData),
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

//for uploading tab image
export const uploadTabImageApi = async (formData) => {
  console.log("Uploading tab image with formData:", formData);
  const token = sessionStorage.getItem("accessToken");
  try {
    const response = await fetch(baseUrl + "/exam/tab-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // don't set Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload tab image");
    }

    const result = await response.json();
    console.log("Tab image upload result:", result);

    if (result?.message) {
      console.log("✅ API Response Message:", result.message);
    }

    return result; // return uploaded file info
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};

export const deleteTabImageApi = async (fileName) => {
  console.log("Filename inside api call ::", fileName); // should log just "1759497132590-771453467.png"
  const token = sessionStorage.getItem("accessToken");
  try {
    const response = await fetch(baseUrl + "/exam/tab-image", {
      method: "DELETE", // backend expects DELETE
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileName }), // ✅ key must match backend
    });

    if (!response.ok) {
      const errText = await response.text(); // log backend response
      throw new Error(`Failed to delete tab image: ${errText}`);
    }

    const result = await response.json();
    console.log("delete tab image api:", result);
    return result;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};

//for deleting questions
export const adminDeleteQuestion = async (id) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const url = `${baseUrl}/exam/questions/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete question with ID ${id}`);
    }

    return { success: true, id }; // ✅ return the deleted id
  } catch (error) {
    throw error;
  }
};

// api/admin.js
export const apiDeleteTest = async (id) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    console.log("inside admin delete test API");
    const url = `${baseUrl}/exam/tests/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete test with ID ${id}`);
    }

    return { success: true, id };
  } catch (error) {
    console.error("Error deleting test:", error);
    throw error;
  }
};

//for fetching mock test questing to create test
export const fetchMockTestQuestionsByCourseId = async (courseId) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(
      `${baseUrl}/exam/list/mock-test-questions?courseId=${courseId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch mock test questions");
    }

    const data = await response.json();
    return data.list; // ✅ only return array of questions
  } catch (error) {
    throw error;
  }
};

// src/api/questionTypeApi.js
export const fetchQuestionTypes = async () => {
  try {
    const response = await fetch(baseUrl + "/exam/list/question-types", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
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
         "https://lunarsenterprises.com:8002/davidsacademy/student/test/list",
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
export const adminCreateTest = async (testData) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    console.log("✅Test data in api call ::: ", testData);
    const response = await fetch(`${baseUrl}/exam/tests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error("Failed to create test");
    }

    return await response.json(); // server response with test details
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
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
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

//for fetching question bank data
export const fetchQBankQuestionData = async (questionId) => {
  console.log("Inside question bank fetching data");
  try {
    console.log("Inside Question Data :: ");

    const response = await fetch(
      baseUrl + "/student/questions/data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ questionId: questionId }),
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
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
export async function adminGetTestQuestions(page = 1, limit = 10) {
  try {
    console.log("✅ Inside admin test questions :: ");
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(
      /*  ${baseUrl}/exam/list/questions/${page}?exam_type=mock test&limit=${limit}`; */
      `${baseUrl}/exam/list/test/${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch test questions: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data by pagig of test ✅✅✅✅::::::::::", data);
    return data; // full response
  } catch (error) {
    console.error("admin Test API Error:", error);
    throw error;
  }
}

export const fetchStudentTests = async (type = "all") => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}/student/test/list?type=${type}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch student tests");
    }
    const data = await response.json();
    // Assuming response structure: { data: [...] } based on TestComponent transformation
    return data.data || [];
  } catch (error) {
    throw error;
  }
};

// List all questions in a specific test (POST based on provided testapis)
export const fetchTestQuestions = async (test_id) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}/student/test/questions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test_id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch test questions: ${response.status}`);
    }
    const data = await response.json();
    console.log("Test questions with headings:", data);
    return data.data || data.list || data;
  } catch (error) {
    throw error;
  }
};

//Fetch question Data by question id
export const fetchTestQuestionData = async (test_id, questionId) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    console.log("Fetching question data for:", { test_id, questionId });

    const response = await fetch(`${baseUrl}/student/questions/data`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_id: String(test_id), // String format
        questionId: String(questionId), // camelCase, not snake_case
        // No headings_id needed!
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Failed to fetch test question data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Question data received:", data);

    if (data.result && data.data) {
      return data.data;
    } else {
      throw new Error(data.message || "No question data received");
    }
  } catch (error) {
    console.error("fetchTestQuestionData error:", error);
    throw error;
  }
};

// Submit test question (POST based on provided testapis)
export const submitTestQuestion = async (
  mode,
  test_id,
  questionId,
  is_correct,
  mark
) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}/student/test/question/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mode, test_id, questionId, is_correct, mark }),
    });
    if (!response.ok) {
      throw new Error("Failed to submit test question");
    }
    const data = await response.json();
    // Return full response for any messages or results
    return data;
  } catch (error) {
    throw error;
  }
};

// Submit entire test (POST based on provided testapis)
export const submitTest = async (test_id) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}/student/test/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test_id }),
    });
    if (!response.ok) {
      throw new Error("Failed to submit test");
    }
    const data = await response.json();
    // Return full response
    return data;
  } catch (error) {
    throw error;
  }
};

// examApi.js
//api for fetching questions by id in admin side
export const adminFetchQuestionByQID = async (questionId) => {
  console.log("➡️ API adminFetchQuestionByQID called with ID:", questionId);

  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}/student/questions/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId }), // ✅ send in body
    });

    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }

    const result = await response.json();
    return result; // single question object
  } catch (error) {
    console.error("❌ Error in adminFetchQuestionByQID:", error);
    throw error;
  }
};
// Fetch sample question IDs (GET, no auth)
export const fetchSampleQuestionnaireIds = async () => {
  try {
    const response = await fetch(`${baseUrl}/exam/sample-questionnaire`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sample questionnaire IDs");
    }

    const data = await response.json();
    return data.data; // Matches your Postman response structure: array of {id: number}
  } catch (error) {
    throw error;
  }
};

// Fetch question data by ID (POST, no auth, adapted from fetchQBankQuestionData)
export const fetchSampleQuestionData = async (questionId) => {
  try {
    const response = await fetch(
      `${baseUrl}/student/questions/sample-questionnaire`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch sample question data");
    }

    const data = await response.json();
    return data.data; // Assumes structure with question details
  } catch (error) {
    throw error;
  }
};

// API call to add a success story
export const addSuccessStoryApi = async (formData) => {
  try {
    const token = sessionStorage.getItem("accessToken");

    const response = await fetch(`${baseUrl}/admin/success-story/create`, {
      method: "POST",
      body: formData, // multipart/form-data
      headers: {
        Authorization: `Bearer ${token}`,

      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add success story");
    }

    const data = await response.json();
    return data; // server response
  } catch (error) {
    throw error;
  }
};


export const fetchSuccessStoriesApi = async () => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}/student/success-story/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch success stories");
    }

    return await response.json(); // should be an array of stories
  } catch (error) {
    throw error;
  }
};



export const deleteSuccessStoryApi = async (id) => {
  console.log("inside delete story");
  try {
    const token = sessionStorage.getItem("accessToken");
    console.log("id::::", id);
    const response = await fetch(
      /* `${baseUrl}/admin/success-story/delete/${id}`, */
      ` ${baseUrl}/admin/success-story/${id}`,

      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete success story");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};


// ✅ Reset Q-Bank API (Admin side)
export const resetQbankApi = async (student_id) => {
  console.log("➡️ Resetting QBank for student:", student_id);
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${baseUrl}/admin/student/reset-qbank`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ student_id }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset Q-Bank");
    }

    const result = await response.json();
    console.log("✅ QBank Reset API Result:", result);
    return result; // structure: { result: true, message: "...", ... }
  } catch (error) {
    console.error("❌ resetQbankApi Error:", error);
    throw error;
  }
};



export const resetMockTestApi = async (student_id, test_id) => {
  console.log("➡️ Resetting Mock Test for student:", student_id, "test:", test_id);
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${baseUrl}/admin/student/reset-test`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ student_id, test_id }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset Mock Test");
    }

    const result = await response.json();
    console.log("✅ Mock Test Reset API Result:", result);
    return result; // example: { result: true, message: "Mock test reset successfully" }
  } catch (error) {
    console.error("❌ resetMockTestApi Error:", error);
    throw error;
  }
};


// src/features/exam/examAPI.js
export const adminUpdateTest = async (testId, updatedData) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}/exam/tests/${testId}`, {
      method: "PUT", // or PATCH depending on backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to update test: ${errText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ adminUpdateTest Error:", error);
    throw error;
  }
};


// NEW API — Get Question Bank Result
export const getQuestionBankResultApi = async (token) => {
  const response = await fetch(`${baseUrl}/student/result/question-bank`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch question bank result");
  }

  return await response.json();
};

