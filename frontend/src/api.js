// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // adjust when deploying
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token is stored separately
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
