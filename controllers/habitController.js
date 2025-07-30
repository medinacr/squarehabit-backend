const Habit = require('../models/Habit'); 
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function recalculateStreaks(completedDates = []) {
  const sortedDates = completedDates
    .map((d) => dayjs(d).format('YYYY-MM-DD'))
    .sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let streakHistory = [];

  let streakStart = null;

  for (let i = 0; i < sortedDates.length; i++) {
    const date = dayjs(sortedDates[i]);

    if (i === 0 || date.diff(dayjs(sortedDates[i - 1]), 'day') === 1) {
      currentStreak++;
      if (!streakStart) streakStart = date;
    } else {
      // push previous streak to history
      if (currentStreak > 1) {
        streakHistory.push({
          start: streakStart.format('YYYY-MM-DD'),
          end: dayjs(sortedDates[i - 1]).format('YYYY-MM-DD'),
          length: currentStreak,
        });
      }

      // reset streak
      currentStreak = 1;
      streakStart = date;
    }

    // track longest
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }

  // push final streak
  if (currentStreak > 1) {
    streakHistory.push({
      start: streakStart.format('YYYY-MM-DD'),
      end: dayjs(sortedDates[sortedDates.length - 1]).format('YYYY-MM-DD'),
      length: currentStreak,
    });
  }

  const lastCompletedDate = sortedDates.length
    ? sortedDates[sortedDates.length - 1]
    : null;

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate,
    streakHistory,
  };
}

const createHabit = async (req, res) => {
  try {
    console.log(req.body)
    const userId = req.user.id;
    const { name, color } = req.body;
  
    const newHabit = new Habit({
      name,
      userId,
      color,
    })
    await newHabit.save()

    res.status(201).json(newHabit);
  } catch(error) {
    res.status(300).json({error: 'Failed to create Habit', error});
  }
};

const getHabits = async (req, res) => {
  try {
    const userId =  req.user.id;

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

const markHabitComplete = async (req, res) => {
  const { habitId } = req.params;
  const { date } = req.body;

  try {
    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    const idx = habit.completedDates.findIndex((d) =>
      dayjs(d).format("YYYY-MM-DD") === formattedDate
    );

    const isTogglingOff = idx > -1;

    if (isTogglingOff) {
      habit.completedDates.splice(idx, 1);
    } else {
      habit.completedDates.push(dayjs(formattedDate).toDate());
    }

    // ✅ Recalculate streaks here
    const { currentStreak, longestStreak, lastCompletedDate, streakHistory } =
      recalculateStreaks(habit.completedDates);

    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;
    habit.lastCompletedDate = lastCompletedDate;
    habit.streakHistory = streakHistory;

    await habit.save();
    res.status(200).json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle habit date" });
  }
};


const deleteHabit = async (req, res) => {
  try {
    console.log(req.params.habitId)

    const userId = req.user.id;
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
  markHabitComplete,
};