const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ error: 'User Already Exists' })
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User ({
      name,
      email, 
      password: hashedPassword,
    });
    console.log(user, 'new user')
    await user.save();
    console.log(user, 'user saved')
    res.status(201).json({ message: 'User Created Successfully', userId: user._id });
  } catch (error) {
    console.error("Error in register controller:", error);  
  res.status(500).json({ error: 'Something Went Wrong', details: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'None', 
        maxAge: 60 * 60 * 1000, 
      })
      .json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password');

    if(!user) {
      return res.status(404).json({ error: 'User Not Found' });
    }

    res.status(200).json(user);
  }catch (error) {
    res.status(500).json({error: 'Error'})
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  });
  return res.status(200).json({ message: 'Logged out Successfully' });
};

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.status(200).json({
      message: 'Authorized Access To Dashboard',
      user,
    });
  } catch (err) {
    console.error('Dashboard Error', err);
    res.status(500).json({ error: 'Server error' });
  };
};

const checkAuth = async (req, res) => {
  res.status(200).json({ message: 'Authenticated' });
};


module.exports = {
  register,
  loginUser,
  getUserInfo,
  logoutUser,
  getDashboard,
  checkAuth,
};