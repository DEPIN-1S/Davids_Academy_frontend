const baseUrl = process.env.REACT_APP_API_URL;
// login user
export const loginUser = async (credentials) => {
  console.log("baseUrlllll:::::::",baseUrl);
  
  const res = await fetch(baseUrl + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const json = await res.json();

  if (!res.ok || json.result !== true) {
    throw new Error(json.message || 'Login failed');
  }

  sessionStorage.setItem('accessToken', json.data.accessToken);
  sessionStorage.setItem('refreshToken', json.data.refreshToken);
  
  return {
    user: {
      id: json.data.id,
      name: json.data.name,
      email: json.data.email,
      role: json.data.role,
    },
    accessToken: json.data.accessToken,
    refreshToken: json.data.refreshToken
  };
};
//create user
export const createUserAPI = async (userData) => {
  const response = await fetch(baseUrl + '/admin/user/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create user');
  }

  return await response.json();
};
// verify otp

export const verifyOtpAPI = async (payload) => {
  const response = await fetch(baseUrl + '/admin/user/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'OTP verification failed');
  }

  return await response.json(); // expected { user, token }
};
// forgot password

export const forgotPasswordAPI = async (emailPayload) => {
  const response = await fetch(baseUrl + '/admin/user/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send reset email');
  }

  return await response.json(); // Expected: { message: 'OTP sent to email' }
};
