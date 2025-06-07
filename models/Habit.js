const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

const Habit = mongoose.model('Habit', habitSchema)

module.exports = Habit;
