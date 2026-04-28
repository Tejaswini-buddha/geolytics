import axios from "axios";

// 🔗 Base URL from Vercel env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
----------------------------------------
🟢 REQUEST INTERCEPTOR
Automatically attach auth token (future JWT ready)
----------------------------------------
*/
API.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");

  if (user) {
    try {
      const parsed = JSON.parse(user);

      // If you later add JWT → this will work automatically
      if (parsed?.access_token) {
        config.headers.Authorization = `Bearer ${parsed.access_token}`;
      }
    } catch (err) {
      console.error("Error parsing user from localStorage", err);
    }
  }

  return config;
});

/*
----------------------------------------
🔴 RESPONSE INTERCEPTOR
Handle errors globally
----------------------------------------
*/
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // 🚨 Auto logout if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/*
----------------------------------------
📦 OPTIONAL HELPER METHODS
----------------------------------------
*/

// Analysis
export const runAnalysis = (keyword, projectId) =>
  API.post(`/full-analysis?keyword=${keyword}&project_id=${projectId}`);

export const getAnalysisHistory = () =>
  API.get("/analysis-history");

// Projects
export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);

// Auth
export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);

export default API;