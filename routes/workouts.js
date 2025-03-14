const express = require('express');
const router = express.Router();
const PersonalRecord = require('../models/PersonalRecord');

// Get all personal records for the current user
router.get('/pr', async (req, res) => {
  try {
    const personalRecords = await PersonalRecord.find({ userId: req.user.id })
      .sort({ exercise: 1, date: -1 });
    res.json(personalRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get personal records for a specific exercise
router.get('/pr/:exercise', async (req, res) => {
  try {
    const personalRecords = await PersonalRecord.find({ 
      userId: req.user.id,
      exercise: req.params.exercise 
    }).sort({ date: -1 });
    
    res.json(personalRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new personal record
router.post('/pr', async (req, res) => {
  try {
    const { exercise, weight, reps, date } = req.body;
    
    // Calculate estimated 1RM using Epley formula: 1RM = weight * (1 + reps/30)
    const estimatedOneRepMax = weight * (1 + reps/30);
    
    const newPR = new PersonalRecord({
      userId: req.user.id,
      exercise,
      weight,
      reps,
      date: date || new Date(),
      estimatedOneRepMax
    });
    
    await newPR.save();
    res.status(201).json(newPR);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing personal record
router.put('/pr/:id', async (req, res) => {
  try {
    const { exercise, weight, reps, date } = req.body;
    
    // Calculate estimated 1RM
    const estimatedOneRepMax = weight * (1 + reps/30);
    
    const pr = await PersonalRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        exercise, 
        weight, 
        reps, 
        date: date || new Date(),
        estimatedOneRepMax 
      },
      { new: true }
    );
    
    if (!pr) {
      return res.status(404).json({ message: 'Personal record not found' });
    }
    
    res.json(pr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a personal record
router.delete('/pr/:id', async (req, res) => {
  try {
    const pr = await PersonalRecord.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!pr) {
      return res.status(404).json({ message: 'Personal record not found' });
    }
    
    res.json({ message: 'Personal record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
