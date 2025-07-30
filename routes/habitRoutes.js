const express = require('express');
const router = express.Router();
const {createHabit, getHabits, toggleHabit, deleteHabit, markHabitComplete} = require('../controllers/habitController');
const verifyToken = require('../middleware/auth');

router.post(`/createHabit`, verifyToken, createHabit);
router.get('/habits', verifyToken, getHabits);
router.delete('/:habitId/delete', verifyToken, deleteHabit);
router.patch(`/:habitId/toggle`, verifyToken, toggleHabit);
router.patch('/:habitId/complete', verifyToken, markHabitComplete);

module.exports = router