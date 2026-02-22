import axios from "axios";

// Contact API calls
export const contactAPI = {
  sendContactMessage: (data) => axios.post("/api/ecocollect/contact", data),
};
