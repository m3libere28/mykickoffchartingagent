import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://kickoff-charting-v2.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kickoff_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('kickoff_token', response.data.token);
  }
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('kickoff_token');
};

export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/auth/status');
    return response.data.authenticated;
  } catch (error) {
    return false;
  }
};

export const uploadFiles = async (files, preferences = null) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  
  if (preferences) {
    formData.append('preferences', preferences);
  }

  const response = await api.post('/extract-adime', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadFollowUpFiles = async (previousFiles, newFiles, preferences = null) => {
  const formData = new FormData();
  
  for (let i = 0; i < previousFiles.length; i++) {
    formData.append('previousFiles', previousFiles[i]);
  }
  for (let i = 0; i < newFiles.length; i++) {
    formData.append('newFiles', newFiles[i]);
  }

  if (preferences) {
    formData.append('preferences', preferences);
  }

  const response = await api.post('/extract-followup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const generatePatientSummary = async (adimeData) => {
  const response = await api.post('/generate-summary', { adimeData });
  return response.data;
};

export default api;
