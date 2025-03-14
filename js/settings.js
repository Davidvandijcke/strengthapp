// settings.js - Settings page functionality

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load current data
    loadPRValues();
    loadSettings();
    
    // Set up event listeners
    setupEventListeners();
  });
  
  // Load current PR values into form
  function loadPRValues() {
    const prs = StorageManager.getPRs();
    
    // Set form values
    document.getElementById('bench-press').value = prs.benchPress;
    document.getElementById('back-squat').value = prs.backSquat;
    document.getElementById('front-squat').value = prs.frontSquat;
    document.getElementById('deadlift').value = prs.deadlift;
    document.getElementById('strict-press').value = prs.strictPress;
    document.getElementById('split-jerk').value = prs.splitJerk;
  }
  
  // Load app settings
  function loadSettings() {
    const settings = StorageManager.getSettings();
    const currentWeek = StorageManager.getCurrentWeek();
    
    // Populate week selector
    const weekSelector = document.getElementById('current-week-setting');
    weekSelector.innerHTML = '';
    
    for (let i = 1; i <= 24; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Week ${i}`;
      if (i === currentWeek) {
        option.selected = true;
      }
      weekSelector.appendChild(option);
    }
    
    // Set other settings
    document.getElementById('units').value = settings.units;
    document.getElementById('plate-calculator').checked = settings.plateCalculator;
    document.getElementById('rest-timer-sound').checked = settings.restTimerSound;
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // PR form submission
    document.getElementById('pr-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get PR values
      const prs = {
        benchPress: parseFloat(document.getElementById('bench-press').value),
        backSquat: parseFloat(document.getElementById('back-squat').value),
        frontSquat: parseFloat(document.getElementById('front-squat').value),
        deadlift: parseFloat(document.getElementById('deadlift').value),
        strictPress: parseFloat(document.getElementById('strict-press').value),
        splitJerk: parseFloat(document.getElementById('split-jerk').value)
      };
      
      // Validate all values are numbers
      for (const [key, value] of Object.entries(prs)) {
        if (isNaN(value) || value <= 0) {
          utils.showToast(`Please enter a valid weight for ${key}`, 'error');
          return;
        }
      }
      
      // Save PRs
      StorageManager.savePRs(prs);
      utils.showToast('PRs updated successfully!', 'success');
    });
    
    // Settings form submission
    document.getElementById('settings-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get settings values
      const settings = {
        units: document.getElementById('units').value,
        plateCalculator: document.getElementById('plate-calculator').checked,
        restTimerSound: document.getElementById('rest-timer-sound').checked
      };
      
      // Save settings
      StorageManager.saveSettings(settings);
      
      // Save current week
      const selectedWeek = parseInt(document.getElementById('current-week-setting').value);
      StorageManager.saveCurrentWeek(selectedWeek);
      
      utils.showToast('Settings saved successfully!', 'success');
    });
    
    // Export data button
    document.getElementById('export-data').addEventListener('click', function() {
      const exportData = StorageManager.exportData();
      
      // Create download link
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `strength_program_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      utils.showToast('Data exported successfully!', 'success');
    });
    
    // Import data button
    document.getElementById('import-data').addEventListener('click', function() {
      // Create file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const result = StorageManager.importData(e.target.result);
            
            if (result) {
              utils.showToast('Data imported successfully!', 'success');
              
              // Reload page to reflect changes
              window.location.reload();
            } else {
              utils.showToast('Error importing data. Invalid format.', 'error');
            }
          };
          
          reader.readAsText(file);
        }
      });
      
      input.click();
    });
    
    // Reset app button
    document.getElementById('reset-app').addEventListener('click', function() {
      // Show confirmation modal
      const confirmModal = document.getElementById('confirm-modal');
      const confirmMessage = document.getElementById('confirm-message');
      
      confirmMessage.textContent = 'This will reset all app data, including PRs, workout history, and settings. This action cannot be undone. Are you sure?';
      
      confirmModal.style.display = 'block';
      
      // Set up confirmation buttons
      document.getElementById('confirm-yes').onclick = function() {
        StorageManager.resetAppData();
        utils.showToast('App data reset successfully!', 'success');
        
        // Close modal
        confirmModal.style.display = 'none';
        
        // Reload page
        window.location.reload();
      };
      
      document.getElementById('confirm-no').onclick = function() {
        confirmModal.style.display = 'none';
      };
    });
  }