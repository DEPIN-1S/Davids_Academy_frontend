export async function listStudents(token, page = 1, limit = 10) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/admin/student/list`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "all",
        page,   // ✅ send current page
        limit,  // ✅ send limit per page
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  const data = await response.json();

  // ✅ Debug log to see exactly what backend sends
  console.log("📦 Students API Response:", data);

  return data; // should look like { list: [], totalPages: X, currentPage: Y }
}



export async function editStudent(studentData, token) {
  const response = await fetch(
    "https://lunarsenterprises.com:6040/davidsacademy/admin/student/edit",
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
    `${process.env.REACT_APP_API_URL}/admin/student/create`,
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
    `${process.env.REACT_APP_API_URL}/admin/student/update-status`,
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


