import axios from "axios";

// Bins API calls
export const binsAPI = {
  getAllBins: () => axios.get("/api/ecocollect/bins"),
  getBinCount: () => axios.get("/api/ecocollect/bins/count"),
  getBinById: (id) => axios.get(`/api/ecocollect/bins/${id}`),
  addBin: (formData) =>
    axios.post("/api/ecocollect/bins", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateBin: (id, formData) =>
    axios.put(`/api/ecocollect/bins/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteBin: (id) => axios.delete(`/api/ecocollect/bins/${id}`),
};
