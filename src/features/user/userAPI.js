// src/features/user/userAPI.js
export const loginUser = async (credentials) => {
  const res = await fetch('http://localhost:6040/davidacademy/admin/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const json = await res.json();

  if (!res.ok || json.result !== true) {
    throw new Error(json.message || 'Login failed');
  }

  return {
    user: {
      id: json.data.id,
      name: json.data.name,
      email: json.data.email,
      role: json.data.role,
    },
    token: json.data.token,
  };
};
