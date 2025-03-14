// progress.js - Progress tracking functionality

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize charts and data
  initializePRChart();
  displayPRHistory();
  initializeVolumeChart();
  displayWorkoutCalendar();
});

// Initialize PR progress chart
function initializePRChart() {
  const prHistory = StorageManager.getPRHistory();
  
  // If no history yet, show message
  if (!prHistory || Object.keys(prHistory).length < 2) {
    document.getElementById('pr-chart').parentNode.innerHTML = 
      '<div class="text-center">Not enough PR data to display chart. Update your PRs as you progress.</div>';
    return;
  }
  
  // Prepare data for chart
  const dates = Object.keys(prHistory).sort();
  const lifts = ['benchPress', 'backSquat', 'frontSquat', 'deadlift', 'strictPress', 'splitJerk'];
  const liftNames = {
    benchPress: 'Bench Press',
    backSquat: 'Back Squat',
    frontSquat: 'Front Squat',
    deadlift: 'Deadlift',
    strictPress: 'Strict Press',
    splitJerk: 'Split Jerk'
  };
  
  // Create datasets for each lift
  const datasets = lifts.map(lift => {
    const data = dates.map(date => prHistory[date][lift]);
    
    return {
      label: liftNames[lift],
      data: data,
      fill: false,
      borderWidth: 2,
      tension: 0.1
    };
  });
  
  // Get chart context
  const ctx = document.getElementById('pr-chart').getContext('2d');
  
  // Create chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Weight (lbs)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
}

// Display PR history in table
function displayPRHistory() {
  const prHistory = StorageManager.getPRHistory();
  const prTable = document.getElementById('pr-history-table');
  
  // If no history yet, show message
  if (!prHistory || Object.keys(prHistory).length === 0) {
    prTable.innerHTML = 
      '<div class="text-center">No PR history available yet. Update your PRs as you progress.</div>';
    return;
  }
  
  // Create table
  const table = document.createElement('table');
  table.className = 'pr-table';
  
  // Create header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  // Add headers
  const dateHeader = document.createElement('th');
  dateHeader.textContent = 'Date';
  headerRow.appendChild(dateHeader);
  
  const lifts = ['benchPress', 'backSquat', 'frontSquat', 'deadlift', 'strictPress', 'splitJerk'];
  const liftNames = {
    benchPress: 'Bench Press',
    backSquat: 'Back Squat',
    frontSquat: 'Front Squat',
    deadlift: 'Deadlift',
    strictPress: 'Strict Press',
    splitJerk: 'Split Jerk'
  };
  
  lifts.forEach(lift => {
    const th = document.createElement('th');
    th.textContent = liftNames[lift];
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create table body
  const tbody = document.createElement('tbody');
  
  // Get dates in descending order
  const dates = Object.keys(prHistory).sort().reverse();
  
  // Add a row for each date
  dates.forEach(date => {
    const row = document.createElement('tr');
    
    // Add date cell
    const dateCell = document.createElement('td');
    dateCell.textContent = date;
    row.appendChild(dateCell);
    
    // Add cells for each lift
    lifts.forEach(lift => {
      const cell = document.createElement('td');
      cell.textContent = prHistory[date][lift] + ' lbs';
      row.appendChild(cell);
    });
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  prTable.appendChild(table);
}

// Initialize volume chart
function initializeVolumeChart() {
  const completedWorkouts = StorageManager.getCompletedWorkouts();
  
  // If no completed workouts yet, show message
  if (!completedWorkouts || Object.keys(completedWorkouts).length === 0) {
    document.getElementById('volume-chart').parentNode.innerHTML = 
      '<div class="text-center">Not enough workout data to display chart yet. Complete workouts to see volume tracking.</div>';
    return;
  }
  
  // Calculate weekly volume (placeholder calculation)
  const weeklyData = {};
  
  // Group workouts by week
  Object.keys(completedWorkouts).forEach(key => {
    const [week, day] = key.split('-').map(Number);
    
    if (!weeklyData[week]) {
      weeklyData[week] = 0;
    }
    
    // Very simplified volume calculation - just count completed workouts
    weeklyData[week]++;
  });
  
  // Convert to arrays for Chart.js
  const weeks = Object.keys(weeklyData).sort((a, b) => a - b);
  const volumes = weeks.map(week => weeklyData[week]);
  
  // Get chart context
  const ctx = document.getElementById('volume-chart').getContext('2d');
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeks.map(week => `Week ${week}`),
      datasets: [{
        label: 'Workouts Completed',
        data: volumes,
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 4,
          title: {
            display: true,
            text: 'Workouts'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Week'
          }
        }
      }
    }
  });
}

// Display workout calendar
function displayWorkoutCalendar() {
  const calendar = document.getElementById('workout-calendar');
  const completedWorkouts = StorageManager.getCompletedWorkouts();
  
  // Create calendar grid (simplified to just current month)
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Create header row with weekday names
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-header';
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });
  
  // Add empty cells for days before first of month
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendar.appendChild(emptyDay);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const calendarDay = document.createElement('div');
    calendarDay.className = 'calendar-day';
    calendarDay.textContent = day;
    
    // Check if there was a workout on this day
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    
    let workoutFound = false;
    
    // Check each completed workout
    Object.keys(completedWorkouts).forEach(key => {
      const workoutDate = new Date(completedWorkouts[key].date);
      const workoutDateString = workoutDate.toISOString().split('T')[0];
      
      if (workoutDateString === dateString) {
        workoutFound = true;
      }
    });
    
    if (workoutFound) {
      calendarDay.classList.add('workout-day');
    }
    
    // Highlight today
    if (day === today.getDate()) {
      calendarDay.classList.add('today');
    }
    
    calendar.appendChild(calendarDay);
  }
}