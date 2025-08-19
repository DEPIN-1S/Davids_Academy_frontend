export async function listStudents(token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/student/list`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "all" })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  const data = await response.json();
  return data;
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
      body: JSON.stringify({ student_id: id })
    }
  );

  const data = await response.json();
  console.log("Delete API parsed JSON:", data);
  return data;
}


