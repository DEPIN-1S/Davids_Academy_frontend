// src/features/user/userAPI.js

export const loginUser = async (credentials) => {
  const response = await fetch('http://your-api.com/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};
