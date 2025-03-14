class ApiService {
  constructor() {
    this.baseUrl = '/api'; // Adjust based on your server setup
    this.token = localStorage.getItem('auth_token'); // Standardize on auth_token
  }

  setAuthToken(token) {
    this.token = token;
  }

  async getUserProgress() {
    return await this.get('/progress');
  }

  async updateUserProgress(data) {
    return await this.put('/progress', data);
  }

  async advanceWorkout() {
    return this._fetch('/progress/advance', 'POST');
  }

  // Personal Records
  async getAllPRs() {
    return this._fetch('/workouts/pr', 'GET');
  }

  async getPRsByExercise(exercise) {
    return this._fetch(`/workouts/pr/${encodeURIComponent(exercise)}`, 'GET');
  }

  async addPR(prData) {
    return this._fetch('/workouts/pr', 'POST', prData);
  }

  async updatePR(id, prData) {
    return this._fetch(`/workouts/pr/${id}`, 'PUT', prData);
  }

  async deletePR(id) {
    return this._fetch(`/workouts/pr/${id}`, 'DELETE');
  }

  async get(endpoint) {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || 'API request failed');
    }
    return await response.json();
  }

  async put(endpoint, data) {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || 'API request failed');
    }
    return await response.json();
  }

  getHeaders() {
    const headers = {'Content-Type': 'application/json'};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  }

  // Helper method for fetch calls
  async _fetch(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: this.getHeaders()
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

// Make available globally
window.ApiService = ApiService;

// Export a singleton instance
const apiService = new ApiService();
export default apiService;