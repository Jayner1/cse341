const Task = require('../models/task');

// GET all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).send('Error retrieving tasks');
  }
};

// POST a new task
exports.createTask = async (req, res) => {
  const newTask = new Task(req.body);
  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).send('Error creating task');
  }
};
