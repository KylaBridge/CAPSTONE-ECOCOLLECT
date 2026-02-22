import axios from "axios";

// Authentication API calls
export const authAPI = {
  // Register
  registerEmailName: (data) =>
    axios.post("/api/ecocollect/auth/register/email", data),
  checkUsernameAvailability: (data) =>
    axios.post("/api/ecocollect/auth/check-username", data),
  registerPassword: (data) =>
    axios.post("/api/ecocollect/auth/register/password", data),
  register: (data) => axios.post("/api/ecocollect/auth/register", data),

  // Login
  login: (data) => axios.post("/api/ecocollect/auth/login", data),
  logout: () => axios.post("/api/ecocollect/auth/logout"),

  // Profile
  getProfile: () => axios.get("/api/ecocollect/auth/profile"),
  verifyPassword: (data) =>
    axios.post("/api/ecocollect/auth/verify-password", data),

  // Session
  getSession: () => axios.get("/api/ecocollect/auth/session"),
  extendSession: () => axios.post("/api/ecocollect/auth/session/extend"),

  // Password Reset
  forgotPassword: (data) =>
    axios.post("/api/ecocollect/auth/forgot-password", data),
  verifyResetCode: (data) =>
    axios.post("/api/ecocollect/auth/verify-reset-code", data),
  resetPassword: (data) =>
    axios.post("/api/ecocollect/auth/reset-password", data),

  // Google OAuth
  googleAuth: () => axios.get("/api/ecocollect/auth/google"),
  googleProfile: () => axios.get("/api/ecocollect/auth/google/profile"),
};
