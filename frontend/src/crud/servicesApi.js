import api from "../services/api";

const servicesApi = {
  getAll: (params = {}) => {
    return api.get("/services", { params });
  },

  getById: (id) => {
    return api.get(`/services/${id}`);
  },

  create: (data) => {
    return api.post("/services", data);
  },

  update: (id, data) => {
    return api.put(`/services/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/services/${id}`);
  },
};

export default servicesApi;
