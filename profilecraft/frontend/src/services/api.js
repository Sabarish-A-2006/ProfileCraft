/**
 * ProfileCraft Frontend API Service
 * Handles all RESTful communication with the Flask backend.
 */

// In development, Vite proxies '/api' to 'http://127.0.0.1:5001'
// Fallback directly to port 5001 if invoked from another origin
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to process fetch responses and handle JSON and HTTP errors gracefully.
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text || `HTTP error ${response.status}: ${response.statusText}` };
  }

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.errors = data.errors || null;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Health check failed:', err.message);
      return { status: 'unreachable', error: err.message };
    }
  },

  /**
   * POST /api/profiles
   * Submit form data to create a new profile.
   */
  async createProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return await handleResponse(response);
  },

  /**
   * GET /api/profiles
   * Retrieve all saved profiles from the backend SQLite database.
   * Optional search string filters name, designation, location, skills.
   */
  async getProfiles(search = '') {
    const url = search
      ? `${API_BASE_URL}/profiles?search=${encodeURIComponent(search.trim())}`
      : `${API_BASE_URL}/profiles`;
    const response = await fetch(url);
    return await handleResponse(response);
  },

  /**
   * GET /api/profiles/:id
   * Retrieve single profile by ID.
   */
  async getProfileById(id) {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
    return await handleResponse(response);
  },

  /**
   * PUT /api/profiles/:id
   * Update an existing profile.
   */
  async updateProfile(id, profileData) {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return await handleResponse(response);
  },

  /**
   * DELETE /api/profiles/:id
   * Delete a profile from the database.
   */
  async deleteProfile(id) {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  },
};

export default api;

