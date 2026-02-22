import axios from "axios";

// Badges API calls
export const badgesAPI = {
  getAllBadges: () => axios.get("/api/ecocollect/badges"),
  getBadgeCount: () => axios.get("/api/ecocollect/badges/count"),
  getBadgeById: (id) => axios.get(`/api/ecocollect/badges/${id}`),
  addBadge: (formData) =>
    axios.post("/api/ecocollect/badges", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateBadge: (id, formData) =>
    axios.put(`/api/ecocollect/badges/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteBadge: (id) => axios.delete(`/api/ecocollect/badges/${id}`),

  // Public badge sharing
  getPublicBadge: (id, params) =>
    axios.get(`/api/ecocollect/badges/public/${id}`, { params }),
};
