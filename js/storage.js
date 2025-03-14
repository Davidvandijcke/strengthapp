// storage.js - Local storage functionality

const StorageManager = {
    // Storage keys
    KEYS: {
      CURRENT_PRs: 'strengthApp.currentPRs',
      CURRENT_WEEK: 'strengthApp.currentWeek',
      COMPLETED_WORKOUTS: 'strengthApp.completedWorkouts',
      COMPLETED_SETS: 'strengthApp.completedSets',
      PR_HISTORY: 'strengthApp.prHistory',
      APP_SETTINGS: 'strengthApp.settings',
      WORKOUT_NOTES: 'strengthApp.workoutNotes'
    },
    
    // Initialize storage with default values if needed
    init: function() {
      // Check if PRs exist, if not, set defaults
      if (!this.getPRs()) {
        this.savePRs(programData.defaultPRs);
      }
      
      // Check if current week exists, if not, set to 1
      if (!this.getCurrentWeek()) {
        this.saveCurrentWeek(1);
      }
      
      // Initialize other storage items if needed
      if (!this.getCompletedWorkouts()) {
        this.saveCompletedWorkouts({});
      }
      
      if (!this.getPRHistory()) {
        this.savePRHistory({});
      }
      
      if (!this.getSettings()) {
        this.saveSettings({
          units: 'lbs',
          plateCalculator: false,
          restTimerSound: true
        });
      }
    },
    
    // PR-related functions
    getPRs: function() {
      const prs = localStorage.getItem(this.KEYS.CURRENT_PRs);
      return prs ? JSON.parse(prs) : null;
    },
    
    savePRs: function(prs) {
      localStorage.setItem(this.KEYS.CURRENT_PRs, JSON.stringify(prs));
      
      // Update PR history
      const prHistory = this.getPRHistory();
      const today = new Date().toISOString().split('T')[0];
      prHistory[today] = prs;
      this.savePRHistory(prHistory);
      
      // Sync with server if authenticated
      if (AuthManager.isAuthenticated()) {
        try {
          const apiService = new ApiService();
          apiService.setAuthToken(AuthManager.getToken());
          
          // Track this change to sync when connection is available
          const unsyncedChanges = JSON.parse(localStorage.getItem('unsyncedChanges') || '{}');
          unsyncedChanges.personalRecords = prs;
          localStorage.setItem('unsyncedChanges', JSON.stringify(unsyncedChanges));
          
          // Try to sync immediately
          apiService.updateUserProgress({ personalRecords: prs })
            .then(() => {
              // Clear this specific change on successful sync
              const remainingChanges = JSON.parse(localStorage.getItem('unsyncedChanges') || '{}');
              delete remainingChanges.personalRecords;
              localStorage.setItem('unsyncedChanges', JSON.stringify(remainingChanges));
            })
            .catch(err => console.error('Error syncing PRs to server:', err));
        } catch (error) {
          console.error('Error preparing to sync:', error);
        }
      }
    },
    
    getPRHistory: function() {
      const history = localStorage.getItem(this.KEYS.PR_HISTORY);
      return history ? JSON.parse(history) : null;
    },
    
    savePRHistory: function(history) {
      localStorage.setItem(this.KEYS.PR_HISTORY, JSON.stringify(history));
      
      // If user is logged in (has token), sync with server
      const token = localStorage.getItem('token');
      if (token) {
        const apiService = new ApiService();
        apiService.setAuthToken(token);
        apiService.updateUserProgress({ prHistory: history })
          .catch(err => console.error('Error syncing PR history to server:', err));
      }
    },
    
    // Current week functions
    getCurrentWeek: function() {
      const week = localStorage.getItem(this.KEYS.CURRENT_WEEK);
      return week ? parseInt(week) : null;
    },
    
    saveCurrentWeek: function(week) {
      localStorage.setItem(this.KEYS.CURRENT_WEEK, week.toString());
      
      // If user is logged in (has token), sync with server
      const token = localStorage.getItem('token');
      if (token) {
        const apiService = new ApiService();
        apiService.setAuthToken(token);
        apiService.updateUserProgress({ currentWeek: week })
          .catch(err => console.error('Error syncing week to server:', err));
      }
    },
    
    // Completed workouts functions
    getCompletedWorkouts: function() {
      const workouts = localStorage.getItem(this.KEYS.COMPLETED_WORKOUTS);
      return workouts ? JSON.parse(workouts) : null;
    },
    
    saveCompletedWorkouts: function(workouts) {
      localStorage.setItem(this.KEYS.COMPLETED_WORKOUTS, JSON.stringify(workouts));
      
      // If user is logged in (has token), sync with server
      const token = localStorage.getItem('token');
      if (token) {
        const apiService = new ApiService();
        apiService.setAuthToken(token);
        apiService.updateUserProgress({ completedWorkouts: workouts })
          .catch(err => console.error('Error syncing completed workouts to server:', err));
      }
    },
    
    markWorkoutComplete: function(week, day) {
      const key = `${week}-${day}`;
      const completed = this.getCompletedWorkouts();
      const completedSets = this.getCompletedSets(week, day);
      
      completed[key] = {
        date: new Date().toISOString(),
        completedSets: completedSets
      };
      
      this.saveCompletedWorkouts(completed);
      return true;
    },
    
    isWorkoutCompleted: function(week, day) {
      const key = `${week}-${day}`;
      const completed = this.getCompletedWorkouts();
      return completed && completed[key];
    },
    
    // Completed sets within a workout
    getCompletedSets: function(week, day) {
      const key = `${week}-${day}`;
      const sets = localStorage.getItem(`${this.KEYS.COMPLETED_SETS}.${key}`);
      return sets ? JSON.parse(sets) : {};
    },
    
    saveCompletedSet: function(week, day, exerciseIndex, setIndex, completed) {
      const key = `${week}-${day}`;
      let sets = this.getCompletedSets(week, day);
      
      if (!sets[exerciseIndex]) {
        sets[exerciseIndex] = {};
      }
      
      sets[exerciseIndex][setIndex] = completed;
      localStorage.setItem(`${this.KEYS.COMPLETED_SETS}.${key}`, JSON.stringify(sets));
      
      // If user is logged in (has token), sync with server
      const token = localStorage.getItem('token');
      if (token) {
        const apiService = new ApiService();
        apiService.setAuthToken(token);
        apiService.updateUserProgress({ completedSets: sets })
          .catch(err => console.error('Error syncing completed sets to server:', err));
      }
    },
    
    // Workout notes
    getWorkoutNotes: function(week, day) {
      const key = `${this.KEYS.WORKOUT_NOTES}.${week}-${day}`;
      return localStorage.getItem(key) || '';
    },
    
    saveWorkoutNotes: function(week, day, notes) {
      const key = `${this.KEYS.WORKOUT_NOTES}.${week}-${day}`;
      localStorage.setItem(key, notes);
      
      // If user is logged in (has token), sync with server
      const token = localStorage.getItem('token');
      if (token) {
        const apiService = new ApiService();
        apiService.setAuthToken(token);
        apiService.updateUserProgress({ workoutNotes: notes })
          .catch(err => console.error('Error syncing workout notes to server:', err));
      }
    },
    
    // Settings functions
    getSettings: function() {
      const settings = localStorage.getItem(this.KEYS.APP_SETTINGS);
      return settings ? JSON.parse(settings) : null;
    },
    
    saveSettings: function(settings) {
      localStorage.setItem(this.KEYS.APP_SETTINGS, JSON.stringify(settings));
      
      // If user is logged in (has token), sync with server
      const token = localStorage.getItem('token');
      if (token) {
        const apiService = new ApiService();
        apiService.setAuthToken(token);
        apiService.updateUserProgress({ settings })
          .catch(err => console.error('Error syncing settings to server:', err));
      }
    },
    
    // Data export/import
    exportData: function() {
      const data = {
        currentPRs: this.getPRs(),
        currentWeek: this.getCurrentWeek(),
        prHistory: this.getPRHistory(),
        completedWorkouts: this.getCompletedWorkouts(),
        settings: this.getSettings()
      };
      
      return JSON.stringify(data);
    },
    
    importData: function(jsonData) {
      try {
        const data = JSON.parse(jsonData);
        
        if (data.currentPRs) {
          this.savePRs(data.currentPRs);
        }
        
        if (data.currentWeek) {
          this.saveCurrentWeek(data.currentWeek);
        }
        
        if (data.prHistory) {
          this.savePRHistory(data.prHistory);
        }
        
        if (data.completedWorkouts) {
          this.saveCompletedWorkouts(data.completedWorkouts);
        }
        
        if (data.settings) {
          this.saveSettings(data.settings);
        }
        
        return true;
      } catch (e) {
        console.error('Error importing data:', e);
        return false;
      }
    },
    
    // Reset all data
    resetAppData: function() {
      localStorage.removeItem(this.KEYS.CURRENT_PRs);
      localStorage.removeItem(this.KEYS.CURRENT_WEEK);
      localStorage.removeItem(this.KEYS.COMPLETED_WORKOUTS);
      localStorage.removeItem(this.KEYS.PR_HISTORY);
      localStorage.removeItem(this.KEYS.APP_SETTINGS);
      
      // Remove all completed sets entries
      for (let i = 1; i <= 24; i++) {
        for (let j = 1; j <= 4; j++) {
          const key = `${this.KEYS.COMPLETED_SETS}.${i}-${j}`;
          localStorage.removeItem(key);
        }
      }
      
      // Remove all workout notes
      for (let i = 1; i <= 24; i++) {
        for (let j = 1; j <= 4; j++) {
          const key = `${this.KEYS.WORKOUT_NOTES}.${i}-${j}`;
          localStorage.removeItem(key);
        }
      }
      
      // Re-initialize with defaults
      this.init();
    }
  };
  
  // Initialize storage on load
  StorageManager.init();
  
  // Make StorageManager available globally
  window.StorageManager = StorageManager;