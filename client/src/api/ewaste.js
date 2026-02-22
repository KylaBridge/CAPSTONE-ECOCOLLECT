import axios from "axios";

// E-waste API calls
export const ewasteAPI = {
  // User submissions
  submitEWaste: (formData) =>
    axios.post("/api/ecocollect/ewaste", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getUserSubmissions: (userId) =>
    axios.get(`/api/ecocollect/ewaste/user/${userId}`),
  getUserSubmitCount: (userId) =>
    axios.get(`/api/ecocollect/ewaste/user/${userId}/count`),

  // Admin
  getAllSubmissions: () => axios.get("/api/ecocollect/ewaste"),
  getEwasteCounts: () => axios.get("/api/ecocollect/ewaste/ewastes"),
  updateSubmissionStatus: (id, data) =>
    axios.put(`/api/ecocollect/ewaste/${id}/status`, data),
  deleteEWaste: (id) => axios.delete(`/api/ecocollect/ewaste/${id}`),
};
