import axios from "axios";

// 🔥 HACKATHON PRO-TIP: 
// Change this to your Ngrok URL during the final presentation!
// e.g., "https://a1b2c3d4.ngrok-free.app/api"
const BACKEND_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: BACKEND_URL
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;