/**
 * Vehicles API - CRUD operations
 * 
 * Endpoints:
 * - GET    /api/vehicles       - List all (with pagination)
 * - POST   /api/vehicles       - Create new
 * - GET    /api/vehicles/{id}  - Get single
 * - PUT    /api/vehicles/{id}  - Update
 * - DELETE /api/vehicles/{id}  - Delete
 */

import api from '../services/api';

const vehiclesApi = {
  async getAll(params = {}) {
    const response = await api.get('/vehicles', { params });
    return response;
  },

  async getById(id) {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  }
};

export default vehiclesApi;
