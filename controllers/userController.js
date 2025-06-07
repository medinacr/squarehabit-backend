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

    await user.save();

    res.status(201).json({ message: 'User Created Successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Something Went Wrong' })
  }
};

const loginUser = async (req, res) => {

  try {
    const { email, password} = req.body;
    const user = await User.findOne({ email });
    
    if(!user) {
      return res.status(400).json({error: 'No User Found'})
    };
    
    const isMatch = await bcrypt.compare(password, user.password)

    // JWT TOKEN
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login Success',
      token,
    });
  }catch(error) {
    res.status(500).json({error: 'Error'})
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
}


module.exports = {
  register,
  loginUser,
  getUserInfo,
};