const express = require('express');
const router = express.Router();
const {createHabit, getHabits, toggleHabit, deleteHabit,} = require('../controllers/habitController');
const verifyToken = require('../middleware/auth');

router.post(`/`, verifyToken, createHabit);
router.get('/', verifyToken, getHabits);
router.delete('/:habitId', verifyToken, deleteHabit);
router.patch(`/:habitId/toggle`, verifyToken, toggleHabit);

module.exports = router