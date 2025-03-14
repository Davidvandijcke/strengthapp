// utils.js - Common utility functions

// Format a weight value based on units
function formatWeight(weight, unit = 'lbs') {
    return `${weight} ${unit}`;
  }
  
  // Calculate weight based on percentage of 1RM
  function calculateWeight(maxWeight, percentage, unit = 'lbs') {
    // Get the raw calculated weight
    const rawWeight = maxWeight * percentage;
    
    // Round to nearest 5 lbs or 2.5 kg
    const roundingValue = unit === 'lbs' ? 5 : 2.5;
    const roundedWeight = Math.round(rawWeight / roundingValue) * roundingValue;
    
    return roundedWeight;
  }
  
  // Format time in MM:SS format
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Get day name from a day number (0-6)
  function getDayName(dayNum) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  }
  
  // Get the workout day (1-4) from a week date
  function getWorkoutDay(date) {
    const day = date.getDay();
    // Workouts are Mon-Thu (1-4)
    return day >= 1 && day <= 4 ? day : null;
  }
  
  // Get today's date in YYYY-MM-DD format
  function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  // Debounce function to limit how often a function can be called
  function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Check if an object is empty
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  
  // Play a sound (for timer)
  function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }
  
  // Create a toast notification
  function showToast(message, type = 'info', duration = 3000) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
      
      // Add toast styles
      toast.style.position = 'fixed';
      toast.style.bottom = '80px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '4px';
      toast.style.color = 'white';
      toast.style.fontSize = '16px';
      toast.style.zIndex = '1000';
      toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    }
    
    // Set toast type
    if (type === 'success') {
      toast.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
      toast.style.backgroundColor = '#e74c3c';
    } else {
      toast.style.backgroundColor = '#3498db';
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.style.display = 'block';
    
    // Hide toast after duration
    setTimeout(() => {
      toast.style.display = 'none';
    }, duration);
  }
  
  // Export all utility functions
  window.utils = {
    formatWeight,
    calculateWeight,
    formatTime,
    getDayName,
    getWorkoutDay,
    getTodayString,
    debounce,
    isEmptyObject,
    playSound,
    showToast
  };