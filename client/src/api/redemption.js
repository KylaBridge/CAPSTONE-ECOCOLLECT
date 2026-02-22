import axios from "axios";

// Redemption API calls
export const redemptionAPI = {
  // User redemptions
  redeemReward: (data) => axios.post("/api/ecocollect/redeem", data),
  getUserRedemptions: (userId) =>
    axios.get(`/api/ecocollect/redeem/user/${userId}`),

  // Admin
  getAllRedemptions: () => axios.get("/api/ecocollect/redeem/all"),
  getRedemptionCount: () => axios.get("/api/ecocollect/redeem/count"),

  // Public validation
  getRedemptionForValidation: (id) =>
    axios.get(`/api/ecocollect/redeem/validate/${id}`),
  confirmRedemption: (id, data) =>
    axios.post(`/api/ecocollect/redeem/confirm/${id}`, data),
};
