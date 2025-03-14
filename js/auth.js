// auth.js - Handle user authentication

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  if (AuthManager.isAuthenticated() && !window.location.pathname.includes('login.html')) {
    // Already authenticated and on a non-login page
    return;
  } else if (AuthManager.isAuthenticated() && window.location.pathname.includes('login.html')) {
    // Already authenticated but on login page, redirect to dashboard
    window.location.href = 'index.html';
    return;
  } else if (!AuthManager.isAuthenticated() && !window.location.pathname.includes('login.html')) {
    // Not authenticated and not on login page, redirect to login
    window.location.href = 'login.html';
    return;
  }
  
  // Set up tab switching
  document.getElementById('login-tab').addEventListener('click', function() {
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
  });
  
  document.getElementById('register-tab').addEventListener('click', function() {
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
  });
  
  // Set up form submissions
  document.getElementById('login-form-element').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    AuthManager.login(email, password)
      .then(() => {
        window.location.href = 'index.html';
      })
      .catch(error => {
        document.getElementById('login-error').textContent = error.message || 'Login failed. Please check your credentials.';
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
  });
  
  document.getElementById('register-form-element').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      document.getElementById('register-error').textContent = 'Passwords do not match';
      return;
    }
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Registering...';
    submitButton.disabled = true;
    
    AuthManager.register(name, email, password)
      .then(() => {
        window.location.href = 'index.html';
      })
      .catch(error => {
        document.getElementById('register-error').textContent = error.message || 'Registration failed. Please try again.';
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
  });
});

// Authentication Manager
const AuthManager = {
  // Check if user is authenticated
  isAuthenticated: function() {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp < Date.now() / 1000) {
        // Token expired, clear it
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // Register new user
  register: async function(name, email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Store token and user info
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      // Initialize sync - load any server data
      await this.loadUserProgress();
      
      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async function(email, password) {
    try {
      const apiUrl = '/api'; // Use consistent API URL
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store token and user info
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      // Initialize API service with token
      const apiService = new ApiService();
      apiService.setAuthToken(data.token);
      
      // Load user data from server
      await this.loadUserProgress();
      
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Load user progress from server
  loadUserProgress: async function() {
    if (!this.isAuthenticated()) return null;
    
    try {
      const apiService = new ApiService();
      apiService.setAuthToken(localStorage.getItem('auth_token'));
      
      const progress = await apiService.getUserProgress();
      
      // Update local storage with server data if available
      if (progress.currentWeek) {
        StorageManager.saveCurrentWeek(progress.currentWeek);
      }
      
      if (progress.currentDay) {
        // If you have function to save current day
        // StorageManager.saveCurrentDay(progress.currentDay);
      }
      
      if (progress.personalRecords) {
        // Only update PRs if there are values from server
        const prs = {};
        let hasValues = false;
        
        Object.entries(progress.personalRecords).forEach(([key, value]) => {
          if (value !== null) {
            prs[key] = value;
            hasValues = true;
          }
        });
        
        if (hasValues) {
          StorageManager.savePRs(prs);
        }
      }
      
      if (progress.completedWorkouts && Object.keys(progress.completedWorkouts).length > 0) {
        StorageManager.saveCompletedWorkouts(progress.completedWorkouts);
      }
      
      return progress;
    } catch (error) {
      console.error('Error loading user progress:', error);
      return null;
    }
  },
  
  // Logout user
  logout: function() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('server_synced');
    // Don't clear program data, just authentication
  },
  
  // Get user data
  getUserData: function() {
    try {
      return JSON.parse(localStorage.getItem('user_data'));
    } catch (e) {
      return null;
    }
  },
  
  // Get token
  getToken: function() {
    return localStorage.getItem('auth_token');
  }
};

// In js/auth.js after successful login
async function handleLoginSuccess(userData, token) {
  // Store token
  localStorage.setItem('token', token);
  
  // Set token for API requests
  apiService.setAuthToken(token);
  
  // Fetch user's progress data from server
  try {
    const userProgress = await apiService.getUserProgress();
    
    // Update local storage with server data
    StorageManager.saveCurrentWeek(userProgress.currentWeek || 1);
    
    // If user has PRs stored on server, update local storage
    if (userProgress.personalRecords) {
      StorageManager.savePRs(userProgress.personalRecords);
    }
    
    // If user has completed workouts, update local storage
    if (userProgress.completedWorkouts) {
      StorageManager.saveCompletedWorkouts(userProgress.completedWorkouts);
    }
    
    // Redirect to dashboard
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Error loading user progress:', error);
    // Still redirect, but we'll use default data
    window.location.href = '/index.html';
  }
}