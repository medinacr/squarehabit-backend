const Habit = require('../models/Habit'); 

const createHabit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;
    
    const newHabit = new Habit({
      name,
      userId,
    })
    await newHabit.save()

    res.status(201).json(newHabit);
  } catch(error) {
    res.status(300).json({error: 'Failed to create Habit', error});
  }
};

const getHabits = async (req, res) => {
  try {
    const {userId} =  req.user;

    const habits = await Habit.find({ userId });

    res.status(200).json(habits);
  } catch(error) {
    res.status(500).json({error: 'Failed to get Habits'});
  }
};

const toggleHabit = async (req, res) => {

  try {
    const userId = req.user.userId;
    const habitId = req.params.habitId;

    const habit = await Habit.findOne({ _id: habitId, userId })
    if(!habit) { x
      return res.status(404).json({ error: 'Habit not found' })
    }

    habit.completed = !habit.completed

    await habit.save()

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({error: 'Failed to toggle Habit'});
  }
};

const deleteHabit = async (req, res) => {
  
  try {

    const userId = req.user.userId;
    const habitId = req.params.habitId;

    const result = await Habit.findOneAndDelete({ _id: habitId, userId });

     if(!result) {
      res.status(404).json('No Habit Found');
     }else {
      res.status(200).json({ message: 'Habit deleted', deletedHabit: result });
     }

  } catch (error) {
    res.status(500).json({error: 'Failed to delete Habit'});
  }
};

module.exports = {
  createHabit,
  getHabits,
  toggleHabit,
  deleteHabit,
};