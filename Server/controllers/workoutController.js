import Workout from "../models/Workout.js";

export const addWorkout = async (req, res) => {
  const workout = await Workout.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(workout);
};

export const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({ userId: req.user.id });
  res.json(workouts);
};
