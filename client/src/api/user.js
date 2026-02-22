import axios from "axios";

// User API calls
export const userAPI = {
  // User data
  getLeaderboards: () => axios.get("/api/ecocollect/user/leaderboards"),
  getUserBadgeHistory: (userId) =>
    axios.get(`/api/ecocollect/user/${userId}/badge-history`),

  // User Management (Admin)
  getAllUsers: () => axios.get("/api/ecocollect/usermanagement"),
  getUserCount: () => axios.get("/api/ecocollect/usermanagement/count"),
  addUser: (data) => axios.post("/api/ecocollect/usermanagement/add", data),
  deleteUser: (id) => axios.delete(`/api/ecocollect/usermanagement/${id}`),
  changeUserRole: (id, data) =>
    axios.patch(`/api/ecocollect/usermanagement/role/${id}`, data),

  // Analytics
  getUserParticipationData: (params) =>
    axios.get("/api/ecocollect/usermanagement/analytics/participation", {
      params,
    }),
};
