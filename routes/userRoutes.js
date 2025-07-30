const express = require('express');
const router = express.Router();
const { register, loginUser, getUserInfo, logoutUser, getDashboard, checkAuth } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

router.post('/register', register);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/account', verifyToken, getUserInfo);
router.get('/dashboard', verifyToken, getDashboard);
router.get('/check-auth', verifyToken, checkAuth);

module.exports = router;