/**
 * Appointments API - CRUD operations
 * 
 * Endpoints:
 * - GET    /api/appointments       - List all (with pagination)
 * - POST   /api/appointments       - Create new
 * - GET    /api/appointments/{id}  - Get single
 * - PUT    /api/appointments/{id}  - Update
 * - DELETE /api/appointments/{id}  - Delete
 */

import api from '../services/api';

const appointmentsApi = {
  async getAll(params = {}) {
    const response = await api.get('/appointments', { params });
    return response;
  },

  async getById(id) {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default appointmentsApi;
