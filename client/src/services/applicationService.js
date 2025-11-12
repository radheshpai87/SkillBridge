import { apiClient } from './apiClient';

export const applicationService = {
  /**
   * Apply to a gig
   */
  async applyToGig(gigId) {
    const response = await apiClient.post(`/applications/gig/${gigId}`);
    return response.application;
  },

  /**
   * Get student's applications
   */
  async getMyApplications() {
    const response = await apiClient.get('/applications/my');
    return response.applications;
  },

  /**
   * Get applications for a specific gig (business only)
   */
  async getApplicationsByGig(gigId) {
    const response = await apiClient.get(`/applications/gig/${gigId}`);
    return response.applications;
  },

  /**
   * Update application status (business only)
   */
  async updateApplicationStatus(applicationId, status) {
    const response = await apiClient.patch(`/applications/${applicationId}/status`, { status });
    return response.application;
  },
};
