const Task = require('../models/taskModel');

const handleError = (res, statusCode, message, error) => {
  console.error(error); 
  return res.status(statusCode).json({
    message: message || 'An unexpected error occurred.',
    error: error.message || error,
  });
};

// GET all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }
    res.status(200).json(tasks);
  } catch (err) {
    handleError(res, 500, 'Error fetching tasks', err);
  }
};

// GET a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    handleError(res, 500, 'Error fetching task', err);
  }
};

// POST a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    if (!title || !description || !dueDate || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    handleError(res, 500, 'Error creating task', err);
  }
};

// PUT to update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(204).send(); 
  } catch (err) {
    handleError(res, 500, 'Error updating task', err);
  }
};


// DELETE a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    handleError(res, 500, 'Error deleting task', err);
  }
};
