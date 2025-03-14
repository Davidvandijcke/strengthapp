// app.js - Main dashboard functionality

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
  });
  
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
    showTodaysWorkout(currentWeek);
    
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
  
  // Show today's workout or next workout
  function showTodaysWorkout(week) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const workoutCard = document.getElementById('workout-card');
    workoutCard.innerHTML = '';
    
    // Workouts are on days 1-4 (Monday to Thursday)
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      // Get today's workout
      const workout = programData.generateWorkout(week, dayOfWeek, StorageManager.getPRs());
      
      if (workout) {
        // Check if workout is completed
        const isCompleted = StorageManager.isWorkoutCompleted(week, dayOfWeek);
        
        // Create workout card content
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        
        const dayLabel = document.createElement('h3');
        dayLabel.textContent = `Day ${dayOfWeek}: ${workout.title}`;
        
        const statusBadge = document.createElement('span');
        statusBadge.className = isCompleted ? 'badge completed' : 'badge';
        statusBadge.textContent = isCompleted ? 'Completed' : 'Today';
        
        cardHeader.appendChild(dayLabel);
        cardHeader.appendChild(statusBadge);
        
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
        
        workoutCard.appendChild(cardHeader);
        workoutCard.appendChild(cardBody);
        
        // Update start workout button
        const startButton = document.getElementById('start-workout');
        startButton.textContent = isCompleted ? 'Review Workout' : 'Start Workout';
        startButton.onclick = function() {
          // Store current day in session storage for the workout page to use
          sessionStorage.setItem('currentWorkoutWeek', week);
          sessionStorage.setItem('currentWorkoutDay', dayOfWeek);
          window.location.href = 'workout.html';
        };
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
        sessionStorage.setItem('currentWorkoutWeek', week);
        sessionStorage.setItem('currentWorkoutDay', 1); // Monday
        window.location.href = 'workout.html';
      };
    }
  }
  
  // Show weekly schedule
  function showWeeklySchedule(week) {
    const scheduleGrid = document.getElementById('weekly-schedule');
    scheduleGrid.innerHTML = '';
    
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    for (let i = 1; i <= 4; i++) {
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
        sessionStorage.setItem('currentWorkoutWeek', week);
        sessionStorage.setItem('currentWorkoutDay', i);
        window.location.href = 'workout.html';
      });
      
      scheduleGrid.appendChild(dayElement);
    }
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Week selector change
    document.getElementById('current-week').addEventListener('change', function() {
      const selectedWeek = parseInt(this.value);
      StorageManager.saveCurrentWeek(selectedWeek);
      updatePhaseInfo(selectedWeek);
      showTodaysWorkout(selectedWeek);
      showWeeklySchedule(selectedWeek);
    });
    
    // Update PRs button
    document.getElementById('update-prs').addEventListener('click', function() {
      window.location.href = 'settings.html';
    });
  }