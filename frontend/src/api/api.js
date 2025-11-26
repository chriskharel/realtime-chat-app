// src/api/api.js
import axios from "axios";

// Use Vercel API (same domain) - no CORS issues!
const baseURL = typeof window !== 'undefined' ? window.location.origin : '';

const API = axios.create({
  baseURL: `${baseURL}/api`,
});

// Automatically attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
