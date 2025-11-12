import { apiClient } from './apiClient';

export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  },

  /**
   * Login user
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.user;
  },

  /**
   * Update user profile
   */
  async updateProfile(updates) {
    const response = await apiClient.patch('/auth/profile/update', updates);
    return response.user;
  },
};
