import axios from 'axios';

export const API_BASE_URL ='http://192.168.0.102:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchFromApi(path: string, options?: RequestInit) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  return fetch(url, options);
}

export default api;
