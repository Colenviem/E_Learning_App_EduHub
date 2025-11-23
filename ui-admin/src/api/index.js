import axios from 'axios';

const BASE_URL = 'https://e-learning-app-eduhub-1.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const endpoints = {
  accounts: '/accounts',
  users: '/users',
  orders: '/orders',
  courses: '/courses',
  categories: '/categories',
  lessons: '/lessons',
  lessonDetails: '/lesson-details',
};

const get = (url, config) => apiClient.get(url, config);
const post = (url, data, config) => apiClient.post(url, data, config);
const put = (url, data, config) => apiClient.put(url, data, config);
const del = (url, config) => apiClient.delete(url, config);

export { BASE_URL, apiClient, endpoints, get, post, put, del };
