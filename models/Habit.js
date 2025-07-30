const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
    },
    completedDates: [Date], 
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: String, 
    },
    streakHistory: [
      {
        start: String,
        end: String,
        length: Number
      }
    ],
  },
  { timestamps: true }
);

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
