// workout.js - Workout view functionality

// Variables for rest timer
let timerInterval;
let currentSeconds = 0;
let timerRunning = false;

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Get workout info from session storage or defaults
  const workoutWeek = sessionStorage.getItem('currentWorkoutWeek') || StorageManager.getCurrentWeek();
  const workoutDay = sessionStorage.getItem('currentWorkoutDay') || 1;
  
  // Load and display the workout
  loadWorkout(workoutWeek, workoutDay);
  
  // Set up timer functionality
  setupTimerFunctionality();
  
  // Set up event listeners
  setupEventListeners(workoutWeek, workoutDay);
});

// Load and display workout
function loadWorkout(week, day) {
  // Parse week and day as integers
  week = parseInt(week, 10);
  day = parseInt(day, 10);
  
  console.log('Loading workout for week:', week, 'day:', day);
  // Get workout data and PRs
  const workout = programData.generateWorkout(parseInt(week, 10), parseInt(day, 10), StorageManager.getPRs());
  const settings = StorageManager.getSettings();
  const units = settings ? settings.units : 'lbs';
  
  // Update page title and header info
  document.getElementById('workout-title').textContent = `${workout.title} (Week ${week})`;
  document.getElementById('week-display').textContent = week;
  document.getElementById('day-display').textContent = day;
  document.getElementById('phase-display').textContent = workout.phase;
  
  // Display warm-up
  displayWarmup(workout.warmup);
  
  // Display main lifts
  displayMainLifts(workout.mainLifts, week, day, units);
  
  // Display accessory work
  displayAccessoryWork(workout.accessoryWork, week, day, workout.mainLifts.length);
  
  // Display notes
  displayNotes(workout.notes);
  
  // Check if this workout has been completed
  const isCompleted = StorageManager.isWorkoutCompleted(week, day);
  if (isCompleted) {
    document.getElementById('complete-workout').textContent = 'Workout Completed';
    document.getElementById('complete-workout').disabled = true;
  }
}

// Display warm-up exercises
function displayWarmup(warmupExercises) {
  const warmupList = document.getElementById('warmup-list');
  warmupList.innerHTML = '';
  
  warmupExercises.forEach(exercise => {
    const li = document.createElement('li');
    li.textContent = exercise;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'warmup-checkbox';
    
    li.prepend(checkbox);
    warmupList.appendChild(li);
  });
}

// Display main lifts
function displayMainLifts(mainLifts, week, day, units) {
  const container = document.getElementById('main-lifts-container');
  container.innerHTML = '';
  
  // Get any previously completed sets
  const completedSets = StorageManager.getCompletedSets(week, day);
  
  mainLifts.forEach((lift, exerciseIndex) => {
    // Create exercise card
    const card = document.createElement('div');
    card.className = 'exercise-card';
    
    // Create card header
    const header = document.createElement('div');
    header.className = 'exercise-header';
    
    const name = document.createElement('div');
    name.className = 'exercise-name';
    name.textContent = lift.name;
    
    header.appendChild(name);
    card.appendChild(header);
    
    // Create exercise detail section
    const detail = document.createElement('div');
    detail.className = 'exercise-detail';
    
    // Handle both normal and PR protocol lifts
    if (lift.isTestProtocol) {
      // PR protocol has individual set details
      lift.sets.forEach((set, setIndex) => {
        const setRow = document.createElement('div');
        setRow.className = 'set-row';
        
        const setNumber = document.createElement('div');
        setNumber.className = 'set-number';
        setNumber.textContent = `${set.setNum}`;
        
        const setReps = document.createElement('div');
        setReps.className = 'set-reps';
        setReps.textContent = `${set.reps} rep${set.reps > 1 ? 's' : ''}`;
        
        const weight = utils.calculateWeight(
          StorageManager.getPRs()[set.prReference], 
          set.percentOfMax, 
          units
        );
        
        const setWeight = document.createElement('div');
        setWeight.className = 'set-weight';
        setWeight.textContent = `${weight} ${units}`;
        
        const setCompleted = document.createElement('div');
        setCompleted.className = 'set-completed';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.exercise = exerciseIndex;
        checkbox.dataset.set = setIndex;
        
        // Check if this set was previously completed
        if (completedSets[exerciseIndex] && completedSets[exerciseIndex][setIndex]) {
          checkbox.checked = true;
        }
        
        // Save set completion status when checkbox changes
        checkbox.addEventListener('change', function() {
          StorageManager.saveCompletedSet(
            parseInt(week, 10), 
            parseInt(day, 10), 
            this.dataset.exercise, 
            this.dataset.set, 
            this.checked
          );
        });
        
        setCompleted.appendChild(checkbox);
        
        setRow.appendChild(setNumber);
        setRow.appendChild(setReps);
        setRow.appendChild(setWeight);
        setRow.appendChild(setCompleted);
        
        const notes = document.createElement('div');
        notes.className = 'set-notes';
        notes.textContent = set.notes;
        
        detail.appendChild(setRow);
        if (set.notes) {
          detail.appendChild(notes);
        }
      });
    } else {
      // Regular lift with sets x reps format
      const weight = utils.calculateWeight(
        StorageManager.getPRs()[lift.prReference], 
        lift.percentOfMax, 
        units
      );
      
      // Create sets info
      const setsInfo = document.createElement('div');
      setsInfo.className = 'sets-info';
      setsInfo.textContent = `${lift.sets} sets × ${lift.reps} reps @ ${weight} ${units}`;
      detail.appendChild(setsInfo);
      
      // Create notes if available
      if (lift.notes) {
        const notes = document.createElement('div');
        notes.className = 'exercise-notes';
        notes.textContent = lift.notes;
        detail.appendChild(notes);
      }
      
      // Create individual set rows
      for (let i = 0; i < lift.sets; i++) {
        const setRow = document.createElement('div');
        setRow.className = 'set-row';
        
        const setNumber = document.createElement('div');
        setNumber.className = 'set-number';
        setNumber.textContent = `${i + 1}`;
        
        const setReps = document.createElement('div');
        setReps.className = 'set-reps';
        setReps.textContent = `${lift.reps} rep${lift.reps > 1 ? 's' : ''}`;
        
        const setWeight = document.createElement('div');
        setWeight.className = 'set-weight';
        setWeight.textContent = `${weight} ${units}`;
        
        const setCompleted = document.createElement('div');
        setCompleted.className = 'set-completed';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.exercise = exerciseIndex;
        checkbox.dataset.set = i;
        
        // Check if this set was previously completed
        if (completedSets[exerciseIndex] && completedSets[exerciseIndex][i]) {
          checkbox.checked = true;
        }
        
        // Save set completion status when checkbox changes
        checkbox.addEventListener('change', function() {
          StorageManager.saveCompletedSet(
            parseInt(week, 10), 
            parseInt(day, 10), 
            this.dataset.exercise, 
            this.dataset.set, 
            this.checked
          );
        });
        
        setCompleted.appendChild(checkbox);
        
        setRow.appendChild(setNumber);
        setRow.appendChild(setReps);
        setRow.appendChild(setWeight);
        setRow.appendChild(setCompleted);
        
        detail.appendChild(setRow);
      }
    }
    
    card.appendChild(detail);
    container.appendChild(card);
  });
}

// Display accessory work
function displayAccessoryWork(accessories, week, day, mainLiftsLength) {
  const container = document.getElementById('accessory-container');
  container.innerHTML = '';
  
  // Get any previously completed sets
  const completedSets = StorageManager.getCompletedSets(week, day);
  
  accessories.forEach((exercise, exerciseIndex) => {
    // Create exercise card
    const card = document.createElement('div');
    card.className = 'exercise-card';
    
    // Create card header
    const header = document.createElement('div');
    header.className = 'exercise-header';
    
    const name = document.createElement('div');
    name.className = 'exercise-name';
    name.textContent = exercise.name;
    
    const intensity = document.createElement('div');
    intensity.className = 'exercise-intensity';
    if (exercise.intensity) {
      intensity.textContent = exercise.intensity;
    }
    
    header.appendChild(name);
    header.appendChild(intensity);
    card.appendChild(header);
    
    // Create exercise detail section
    const detail = document.createElement('div');
    detail.className = 'exercise-detail';
    
    // Create sets info
    const setsInfo = document.createElement('div');
    setsInfo.className = 'sets-info';
    setsInfo.textContent = `${exercise.sets} sets × ${exercise.reps}`;
    detail.appendChild(setsInfo);
    
    // Create notes if available
    if (exercise.notes) {
      const notes = document.createElement('div');
      notes.className = 'exercise-notes';
      notes.textContent = exercise.notes;
      detail.appendChild(notes);
    }
    
    // Create individual set rows
    for (let i = 0; i < exercise.sets; i++) {
      const setRow = document.createElement('div');
      setRow.className = 'set-row';
      
      const setNumber = document.createElement('div');
      setNumber.className = 'set-number';
      setNumber.textContent = `${i + 1}`;
      
      const setReps = document.createElement('div');
      setReps.className = 'set-reps';
      setReps.textContent = exercise.reps;
      
      const setWeight = document.createElement('div');
      setWeight.className = 'set-weight';
      if (exercise.intensity) {
        setWeight.textContent = exercise.intensity;
      } else {
        setWeight.textContent = '—';
      }
      
      const setCompleted = document.createElement('div');
      setCompleted.className = 'set-completed';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.exercise = mainLiftsLength + exerciseIndex; // Offset by main lifts
      checkbox.dataset.set = i;
      
      // Check if this set was previously completed
      const exerciseKey = mainLiftsLength + exerciseIndex;
      if (completedSets[exerciseKey] && completedSets[exerciseKey][i]) {
        checkbox.checked = true;
      }
      
      // Save set completion status when checkbox changes
      checkbox.addEventListener('change', function() {
        StorageManager.saveCompletedSet(
          parseInt(week, 10), 
          parseInt(day, 10), 
          this.dataset.exercise, 
          this.dataset.set, 
          this.checked
        );
      });
      
      setCompleted.appendChild(checkbox);
      
      setRow.appendChild(setNumber);
      setRow.appendChild(setReps);
      setRow.appendChild(setWeight);
      setRow.appendChild(setCompleted);
      
      detail.appendChild(setRow);
    }
    
    card.appendChild(detail);
    container.appendChild(card);
  });
}

// Display workout notes
function displayNotes(notes) {
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = '';
  
  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note;
    notesList.appendChild(li);
  });
}

// Set up timer functionality
function setupTimerFunctionality() {
  const timerToggle = document.getElementById('timer-toggle');
  const timerModal = document.getElementById('timer-modal');
  const closeModal = document.querySelector('.close-modal');
  const timerValue = document.getElementById('timer-value');
  const modalTimerValue = document.getElementById('modal-timer-value');
  
  // Timer control buttons
  const timerStart = document.getElementById('timer-start');
  const timerPause = document.getElementById('timer-pause');
  const timerReset = document.getElementById('timer-reset');
  
  // Timer preset buttons
  const preset30 = document.getElementById('timer-30');
  const preset60 = document.getElementById('timer-60');
  const preset90 = document.getElementById('timer-90');
  const preset120 = document.getElementById('timer-120');
  const preset180 = document.getElementById('timer-180');
  const preset300 = document.getElementById('timer-300');
  
  // Open timer modal
  timerToggle.addEventListener('click', function() {
    timerModal.style.display = 'block';
  });
  
  // Close timer modal
  closeModal.addEventListener('click', function() {
    timerModal.style.display = 'none';
  });
  
  // Also close when clicking outside the modal
  window.addEventListener('click', function(event) {
    if (event.target === timerModal) {
      timerModal.style.display = 'none';
    }
  });
  
  // Timer preset buttons
  preset30.addEventListener('click', function() { setTimer(30); });
  preset60.addEventListener('click', function() { setTimer(60); });
  preset90.addEventListener('click', function() { setTimer(90); });
  preset120.addEventListener('click', function() { setTimer(120); });
  preset180.addEventListener('click', function() { setTimer(180); });
  preset300.addEventListener('click', function() { setTimer(300); });
  
  // Timer control buttons
  timerStart.addEventListener('click', startTimer);
  timerPause.addEventListener('click', pauseTimer);
  timerReset.addEventListener('click', resetTimer);
}

// Set timer to a specific number of seconds
function setTimer(seconds) {
  resetTimer();
  currentSeconds = seconds;
  updateTimerDisplay();
}

// Start the timer
function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    timerInterval = setInterval(function() {
      if (currentSeconds > 0) {
        currentSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
        timerComplete();
      }
    }, 1000);
  }
}

// Pause the timer
function pauseTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  }
}

// Reset the timer
function resetTimer() {
  pauseTimer();
  currentSeconds = 0;
  updateTimerDisplay();
}

// Update timer displays
function updateTimerDisplay() {
  const formattedTime = utils.formatTime(currentSeconds);
  const timerValue = document.getElementById('timer-value');
  const modalTimerValue = document.getElementById('modal-timer-value');
  timerValue.textContent = formattedTime;
  modalTimerValue.textContent = formattedTime;
}

// Timer complete notification
function timerComplete() {
  // Play sound if enabled
  const settings = StorageManager.getSettings();
  if (settings && settings.restTimerSound) {
    utils.playSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLHOz3PSchGE3J67S6Lw6EwpVw+PIcjcMPqDO6LtabWs8TlZwh6vN7MdhIw5Hm9jvzoZSKRUyeazW8rd1YzAmWrrV6bpOKiQnXr7b6IIuDAE3i9Xz2ZlnPRwJJliUtOXwpl4oCRQ5h7znxmo4CgBRr+S7Y0U5BEuh2ezZkFkZBStsweWwXj8TBliw3cFmSCcCJla04fPEeWpKMEhRQTczNjRXiLff5IETI9X/5Ygqz9uJc15SRGWo0NDtwoPBg5iXoJjI3On9/+rGhJh5RvvyxtfW4unNua5aPpbp+/L//PDfs++v1+72jmUEi/L/cGJEUNTP1P79JdP9t88Xlq+/9///rGI8Yeru87nv//+Xmat6YHW24v7//6lZQ2+14XNifT9p4vLrxA0LAl2t4XWvcn49rICZdRNXVJTEeR8SHUVssNvovJA0KUKOyr6WfmCav9aYgYdjg6yxtq6sxd3t+iUHBQI5TVJXcJ3BtFFFNjBOjay9uRoeHDNwi5mQ2tMeBQJXoL7PsrutmiwTN2m13vv9m0ZCbN0WAABcdZ3s//+1VCcmPVpl2ykGChUutv3//5NWWXx0aQkutf///4t0lIx3fxoBDTS87fvLt5FMR26RYXY9fZKzYFBMQX+q3MCnWE1psNJOIjFPl8zpkFZwpswvFhs2Y6TctWpDTHer2jgVDTBswealUkt0tdVUHAs9Y5/fxswXBQA9gr6OVl2Iq9pYHQ44Y7XvpQsDAVCz53MtFRtdr8GtSjk/bcq9djwu'); // This would be a base64 encoded sound
  }
  
  // Show notification
  utils.showToast('Rest time completed!', 'success');
}

// Set up event listeners
function setupEventListeners(week, day) {
  // Complete workout button
  document.getElementById('complete-workout').addEventListener('click', function() {
    StorageManager.markWorkoutComplete(parseInt(week, 10), parseInt(day, 10));
    utils.showToast('Workout completed!', 'success');
    
    // Disable button after completion
    this.textContent = 'Workout Completed';
    this.disabled = true;
  });
}