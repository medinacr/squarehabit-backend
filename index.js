const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
const cookieParser = require('cookie-parser');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'], 
  credentials: true,               
};

app.use(cors(corsOptions));       
app.use(cookieParser());           
app.use(express.json());           

app.use('/', userRoutes);
app.use('/', habitRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('SquareHabit API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
