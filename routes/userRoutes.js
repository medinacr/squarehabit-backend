const express = require('express');
const router = express.Router();
const { register, loginUser, getUserInfo } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

router.post('/register', register);
router.post('/login', loginUser);

router.get('/account', verifyToken, getUserInfo);

module.exports = router;