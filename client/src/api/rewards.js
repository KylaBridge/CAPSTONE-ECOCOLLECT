import axios from "axios";

// Rewards API calls
export const rewardsAPI = {
  // Rewards
  getAllRewards: () => axios.get("/api/ecocollect/rewards"),
  addReward: (formData) =>
    axios.post("/api/ecocollect/rewards", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateReward: (id, formData) =>
    axios.put(`/api/ecocollect/rewards/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteReward: (id) => axios.delete(`/api/ecocollect/rewards/${id}`),
  getRewardRedemptionStats: () =>
    axios.get("/api/ecocollect/rewards/redemption-stats"),
};
