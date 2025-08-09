const baseUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');

export async function listStudents(token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/student/list`, {
    method: "POST", 
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    
    body: JSON.stringify({}) 
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  const data = await response.json();
  return data;
}
