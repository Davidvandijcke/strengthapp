const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentWeek: {
    type: Number,
    default: 1
  },
  currentDay: {
    type: Number,
    default: 1
  },
  programId: {
    type: String,
    default: 'default'  // Identifier for which program they're on
  },
  personalRecords: {
    benchPress: { type: Number, default: null },
    backSquat: { type: Number, default: null },
    frontSquat: { type: Number, default: null },
    deadlift: { type: Number, default: null },
    strictPress: { type: Number, default: null },
    splitJerk: { type: Number, default: null }
  },
  completedWorkouts: {
    type: Map,
    of: Boolean,
    default: {}
  },
  workoutNotes: {
    type: Map,
    of: String,
    default: {}
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastWorkoutDate: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);