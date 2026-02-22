import axios from "axios";

// Activity Log API calls
export const activityLogAPI = {
  getAllActivityLogs: () => axios.get("/api/ecocollect/activity-logs"),
  getUserActivityLogs: (userId) =>
    axios.get(`/api/ecocollect/activity-logs/user/${userId}`),
  addActivityLog: (data) => axios.post("/api/ecocollect/activity-logs", data),
};
