// Connexion a l'API
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
});

// Login
export const login = async (email: string, password: string) => {
  const response = await api.post('/user/login', {
    email,
    password,
  });
  return response.data;
};

// Get user
export const getUserProfile = async (token: string) => {
  const response = await api.post(
    '/user/profile',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Put user
export const updateUser = async (token: string, user: { firstName: string, lastName: string}) => {
  const response = await api.put('/user/profile', user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};