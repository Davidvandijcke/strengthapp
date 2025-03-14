// app.js - Main dashboard functionality

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
      // Check authentication status and update UI
      updateAuthUI();
      
      // Initialize dashboard
      initializeDashboard();
      
      // Set up event listeners
      setupEventListeners();
      
      // Setup online/offline detection
      setupNetworkDetection();
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      showErrorMessage('Could not initialize dashboard. Please refresh the page.');
    }
});

// Show error message to user
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

// Setup network status detection
function setupNetworkDetection() {
    function updateOnlineStatus() {
        const status = navigator.onLine ? 'online' : 'offline';
        document.body.dataset.networkStatus = status;
        
        const statusMessage = document.getElementById('network-status') || 
                            document.createElement('div');
        
        if (!document.getElementById('network-status')) {
            statusMessage.id = 'network-status';
            document.body.appendChild(statusMessage);
        }
        
        statusMessage.className = status;
        statusMessage.textContent = status === 'online' ? 
            'Connected' : 'Offline - Changes will sync when connection is restored';
        
        // Auto-hide online message
        if (status === 'online') {
            setTimeout(() => statusMessage.classList.add('fade-out'), 2000);
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial check
}
  
// Initialize dashboard with current data
function initializeDashboard() {
    // Get current week and PRs
    const currentWeek = StorageManager.getCurrentWeek();
    const currentPRs = StorageManager.getPRs();
    
    // Set current week in selector
    const weekSelector = document.getElementById('current-week');
    populateWeekSelector(weekSelector, currentWeek);
    
    // Update phase information
    updatePhaseInfo(currentWeek);
    
    // Display PRs
    displayPRs(currentPRs);
    
    // Show today's workout
    showDashboardWorkout(currentWeek);
    
    // Show weekly schedule
    showWeeklySchedule(currentWeek);
}

// Populate week selector dropdown
function populateWeekSelector(selector, currentWeek) {
    selector.innerHTML = '';
    
    for (let i = 1; i <= 24; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Week ${i}`;
      if (i === currentWeek) {
        option.selected = true;
      }
      selector.appendChild(option);
    }
  }
  
  // Update phase information based on current week
  function updatePhaseInfo(week) {
    const phase = programData.getPhaseForWeek(week);
    const phaseDescription = programData.phaseDescriptions[phase];
    
    document.getElementById('phase-display').textContent = `${phase} Phase`;
    document.getElementById('phase-description').textContent = phaseDescription;
    
    // Update progress bar
    updatePhaseProgress(week, phase);
  }
  
  // Update visual progress within the current phase
  function updatePhaseProgress(week, phase) {
    let progressPercent = 0;
    
    // Find which week in the phase this is
    const matchingPhase = programData.phases.find(p => p.name === phase);
    if (matchingPhase) {
      const weeksInPhase = matchingPhase.weeks;
      const index = weeksInPhase.indexOf(parseInt(week));
      if (index !== -1) {
        progressPercent = ((index + 1) / weeksInPhase.length) * 100;
      }
    }
    
    // Update progress bar
    const progressBar = document.getElementById('phase-progress');
    progressBar.style.width = `${progressPercent}%`;
  }
  
  // Display user's current PRs
  function displayPRs(prs) {
    const prDisplay = document.getElementById('pr-display');
    prDisplay.innerHTML = '';
    
    const prNames = {
      benchPress: 'Bench Press',
      backSquat: 'Back Squat',
      frontSquat: 'Front Squat',
      deadlift: 'Deadlift',
      strictPress: 'Strict Press',
      splitJerk: 'Split Jerk'
    };
    
    for (const [key, value] of Object.entries(prs)) {
      const prItem = document.createElement('div');
      prItem.className = 'pr-item';
      
      const label = document.createElement('div');
      label.className = 'pr-label';
      label.textContent = prNames[key] || key;
      
      const prValue = document.createElement('div');
      prValue.className = 'pr-value';
      prValue.textContent = `${value} lbs`;
      
      prItem.appendChild(label);
      prItem.appendChild(prValue);
      prDisplay.appendChild(prItem);
    }
  }
  
  // Show today's workout on dashboard
function showDashboardWorkout(week) {
    week = parseInt(week, 10);
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const workoutCard = document.getElementById('workout-card');
    workoutCard.innerHTML = '';
    
    // Workouts are on days 1-4 (Monday to Thursday)
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        try {
            // Get today's workout
            const workout = programData.generateWorkout(week, dayOfWeek, StorageManager.getPRs());
            
            if (workout) {
                // Check if workout is completed
                const isCompleted = StorageManager.isWorkoutCompleted(week, dayOfWeek);
                
                // Create workout card with document fragment for better performance
                const fragment = document.createDocumentFragment();
                
                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header';
                
                const dayLabel = document.createElement('h3');
                dayLabel.textContent = `Day ${dayOfWeek}: ${workout.title}`;
                
                const statusBadge = document.createElement('span');
                statusBadge.className = isCompleted ? 'badge completed' : 'badge';
                statusBadge.textContent = isCompleted ? 'Completed' : 'Today';
                
                cardHeader.appendChild(dayLabel);
                cardHeader.appendChild(statusBadge);
                fragment.appendChild(cardHeader);
                
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                
                // Add primary lifts preview
                if (workout.mainLifts && workout.mainLifts.length > 0) {
                    const primaryLifts = document.createElement('div');
                    primaryLifts.className = 'primary-lifts-preview';
                    
                    const lift = workout.mainLifts[0];
                    if (lift.isTestProtocol) {
                        primaryLifts.textContent = 'PR Testing Day';
                    } else {
                        primaryLifts.textContent = `${lift.name}: ${lift.sets} × ${lift.reps}`;
                    }
                    
                    cardBody.appendChild(primaryLifts);
                }
                
                fragment.appendChild(cardBody);
                workoutCard.appendChild(fragment);
                
                // Update start workout button
                const startButton = document.getElementById('start-workout');
                startButton.textContent = isCompleted ? 'Review Workout' : 'Start Workout';
                startButton.onclick = function() {
                    navigateToWorkout(week, dayOfWeek);
                };
            }
        } catch (error) {
            console.error('Error loading today\'s workout:', error);
            workoutCard.innerHTML = '<p class="error">Could not load workout details</p>';
        }
    } else {
        // Show next workout (next Monday)
        const nextWorkout = document.createElement('div');
        nextWorkout.className = 'rest-day';
        nextWorkout.innerHTML = `<h3>Rest Day</h3><p>Next workout: Monday (Day 1)</p>`;
        workoutCard.appendChild(nextWorkout);
        
        // Update start workout button
        const startButton = document.getElementById('start-workout');
        startButton.textContent = 'View Next Workout';
        startButton.onclick = function() {
            navigateToWorkout(week, 1); // Monday
        };
    }
}

// Show weekly schedule
function showWeeklySchedule(week) {
    week = parseInt(week, 10);
    const scheduleGrid = document.getElementById('weekly-schedule');
    scheduleGrid.innerHTML = '';
    
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 1; i <= 4; i++) {
        try {
            const dayElement = document.createElement('div');
            dayElement.className = 'schedule-day';
            
            // Add active class if this is today
            if (i === currentDayOfWeek) {
                dayElement.classList.add('active');
            }
            
            // Add completed class if workout is done
            if (StorageManager.isWorkoutCompleted(week, i)) {
                dayElement.classList.add('completed');
            }
            
            // Get the workout for this day
            const workout = programData.generateWorkout(week, i, StorageManager.getPRs());
            
            dayElement.textContent = `Day ${i}: ${workout ? workout.title : 'Rest'}`;
            
            // Make clickable
            dayElement.addEventListener('click', function() {
                navigateToWorkout(week, i);
            });
            
            fragment.appendChild(dayElement);
        } catch (error) {
            console.error(`Error loading day ${i} schedule:`, error);
        }
    }
    
    scheduleGrid.appendChild(fragment);
}

// Set up event listeners
function setupEventListeners() {
    // Week selector change
    document.getElementById('current-week').addEventListener('change', function() {
        const selectedWeek = parseInt(this.value, 10);
        StorageManager.saveCurrentWeek(selectedWeek);
        updatePhaseInfo(selectedWeek);
        showDashboardWorkout(selectedWeek);
        showWeeklySchedule(selectedWeek);
    });
    
    // Update PRs button
    document.getElementById('update-prs').addEventListener('click', function() {
        window.location.href = 'settings.html';
    });

    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', function() {
        AuthManager.logout();
        updateAuthUI();
    });
}

// Single function for navigating to workout page
function navigateToWorkout(week, day) {
    // Ensure week and day are numbers
    week = parseInt(week, 10) || StorageManager.getCurrentWeek();
    day = parseInt(day, 10) || 1;
    
    // Store in session for the workout page
    sessionStorage.setItem('currentWorkoutWeek', week);
    sessionStorage.setItem('currentWorkoutDay', day);
    
    // Navigate to workout page
    window.location.href = 'workout.html';
}

// Function to update UI based on authentication status
function updateAuthUI() {
    const isAuthenticated = AuthManager.isAuthenticated();
    const authStatus = document.getElementById('auth-status');
    const authButtons = document.getElementById('auth-buttons');
    
    if (isAuthenticated) {
        // User is logged in
        authStatus.style.display = 'flex';
        authButtons.style.display = 'none';
        
        // Set user name
        const userData = AuthManager.getUserData();
        if (userData && document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = userData.username || userData.email || 'User';
        }
        
        // Sync data with server
        syncUserDataWithServer();
    } else {
        // User is not logged in
        authStatus.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

// Function to sync local data with server
async function syncUserDataWithServer() {
    try {
        // If we're authenticated but don't have server data yet,
        // fetch from server
        if (!localStorage.getItem('server_synced')) {
            await AuthManager.loadUserProgress();
            localStorage.setItem('server_synced', 'true');
        }
        
        // If we have local changes, push to server
        const localChanges = JSON.parse(localStorage.getItem('unsyncedChanges') || '{}');
        if (Object.keys(localChanges).length > 0) {
            const apiService = new ApiService();
            await apiService.updateUserProgress(localChanges);
            localStorage.removeItem('unsyncedChanges');
        }
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}