const baseUrl = process.env.REACT_APP_API_URL;
export async function listStudents(token, page = 1, limit = 10, searchQuery = "", filterStatus = "all") {
  const response = await fetch(
    `${baseUrl}/admin/student/list`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page,
        limit,
        searchQuery: searchQuery || "",   // ✅ match backend key
        type: filterStatus,               // ✅ backend expects "all" | "active" | "inactive"
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  const data = await response.json();
  console.log("📦 Students API Response:", data);
  return data;
}




export async function fetchStudentTestProgress(studentId) {
  const token = sessionStorage.getItem("accessToken"); // ✅ get token from sessionStorage

  if (!token) {
    throw new Error("No access token found in sessionStorage");
  }

  const response = await fetch(
    { baseUrl } + "/admin/student/test",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_id: studentId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch test progress");
  }

  const data = await response.json();
  console.log(`Test progress data for student ${studentId}:`, data);
  return data;
}




export async function editStudent(studentData, token) {
  const response = await fetch(
    { baseUrl } + " /admin/student/edit",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    }
  );

  let data;
  try {
    console.log("Inside studenet edit api");

    data = await response.json();
  } catch (err) {
    console.error("Failed to parse JSON from response:", err);
    throw new Error("Invalid response from server");
  }

  if (!response.ok || data.result === false) {
    throw new Error(data.message || "Failed to edit student");
  }

  return data; // or return data.student if you only need updated student
}





// Add student API function
export async function addStudent(studentData, token) {
  console.log("adding in student api");

  const response = await fetch(
    `${baseUrl}/admin/student/create`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    }
  );

  const data = await response.json();
  console.log("Backend response:", data);

  if (!response.ok || data.result === false) {
    // throw backend message instead of generic error
    throw new Error(data.message || "Failed to add student");
  }

  return data;
}




export async function deleteStudent(id, token) {
  console.log("Sending delete body:", { student_id: id });

  const response = await fetch(
    `${baseUrl}/admin/student/update-status`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_id: id }),
    }
  );

  const data = await response.json();
  console.log("Delete API parsed JSON:", data);

  if (!response.ok || data.result === false) {
    throw new Error(data.message || "Failed to update student status");
  }

  return data;
}


