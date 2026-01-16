import api from "../services/api";

const repairOrdersApi = {
  getAll: (params = {}) => {
    return api.get("/repair-orders", { params });
  },

  getById: (id) => {
    return api.get(`/repair-orders/${id}`);
  },

  create: (data) => {
    return api.post("/repair-orders", data);
  },

  update: (id, data) => {
    return api.put(`/repair-orders/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/repair-orders/${id}`);
  },
};

export default repairOrdersApi;
