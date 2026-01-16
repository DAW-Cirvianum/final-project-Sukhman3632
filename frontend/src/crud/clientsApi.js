import api from "../services/api";

const clientsApi = {
  getAll: (params = {}) => {
    return api.get("/clients", { params });
  },

  getById: (id) => {
    return api.get(`/clients/${id}`);
  },

  create: (data) => {
    return api.post("/clients", data);
  },

  update: (id, data) => {
    return api.put(`/clients/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/clients/${id}`);
  },
};

export default clientsApi;
