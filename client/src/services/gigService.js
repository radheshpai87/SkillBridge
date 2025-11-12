import { apiClient } from './apiClient';

export const gigService = {
  /**
   * Get all gigs
   */
  async getAllGigs() {
    const response = await apiClient.get('/gigs/all');
    return response.gigs;
  },

  /**
   * Get a single gig by ID
   */
  async getGig(gigId) {
    const response = await apiClient.get(`/gigs/${gigId}`);
    return response.gig;
  },

  /**
   * Get matched gigs for student
   */
  async getMatchedGigs() {
    const response = await apiClient.get('/gigs/matched');
    return response.gigs;
  },

  /**
   * Get business's own gigs
   */
  async getMyGigs() {
    const response = await apiClient.get('/gigs/my');
    return response.gigs;
  },

  /**
   * Create a new gig
   */
  async createGig(gigData) {
    const response = await apiClient.post('/gigs/create', gigData);
    return response.gig;
  },

  /**
   * Update a gig
   */
  async updateGig(gigId, updates) {
    const response = await apiClient.patch(`/gigs/${gigId}`, updates);
    return response.gig;
  },

  /**
   * Delete a gig
   */
  async deleteGig(gigId) {
    const response = await apiClient.delete(`/gigs/${gigId}`);
    return response;
  },
};
