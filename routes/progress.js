const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');

// Get current user progress
router.get('/', async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user.id });
    
    // If user doesn't have progress entry yet, create one
    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user.id,
        currentWeek: 1,
        currentDay: 1,
        programId: 'default'
      });
    }
    
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user progress
router.put('/', async (req, res) => {
  try {
    const { 
      currentWeek, 
      currentDay, 
      programId,
      personalRecords,
      completedWorkouts,
      workoutNotes,
      settings
    } = req.body;
    
    // Find and update or create if not exists
    let progress = await UserProgress.findOneAndUpdate(
      { userId: req.user.id },
      { 
        // Only update fields that are provided
        ...(currentWeek !== undefined && { currentWeek }),
        ...(currentDay !== undefined && { currentDay }),
        ...(programId !== undefined && { programId }),
        ...(personalRecords !== undefined && { personalRecords }),
        ...(completedWorkouts !== undefined && { completedWorkouts }),
        ...(workoutNotes !== undefined && { workoutNotes }),
        ...(settings !== undefined && { settings }),
        lastWorkoutDate: new Date(),
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Advance to next workout
router.post('/advance', async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user.id,
        currentWeek: 1,
        currentDay: 1,
        programId: 'default'
      });
    } else {
      // Logic to advance to next workout day/week
      // This depends on your program structure - here's a simple example:
      if (progress.currentDay < 3) { // Assuming 3 days per week
        progress.currentDay += 1;
      } else {
        progress.currentDay = 1;
        progress.currentWeek += 1;
      }
      
      progress.lastWorkoutDate = new Date();
      progress.updatedAt = new Date();
      await progress.save();
    }
    
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;