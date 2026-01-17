const API_URL = 'http://localhost:5000/auth';

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const getMe = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
