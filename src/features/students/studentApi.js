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
  console.log("adding in studen api");
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
  if (!response.ok) {
    throw new Error("Failed to add student");
  }
  return await response.json();
}
