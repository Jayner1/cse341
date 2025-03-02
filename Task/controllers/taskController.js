const Task = require('../models/taskModel');

const handleError = (res, statusCode, message, error) => {
  console.error(error);
  return res.status(statusCode).json({
    message: message || 'An unexpected error occurred.',
    error: error.message || error,
  });
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0]; 
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }
    const formattedTasks = tasks.map(task => ({
      ...task._doc,
      dueDate: formatDate(task.dueDate),
    }));
    res.status(200).json(formattedTasks);
  } catch (err) {
    handleError(res, 500, 'Error fetching tasks', err);
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });
    res.status(200).json({
      ...task._doc,
      dueDate: formatDate(task.dueDate),
    });
  } catch (err) {
    handleError(res, 500, 'Error fetching task', err);
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const newTask = new Task({
      title,
      description,
      dueDate: new Date(dueDate), 
      status,
      userId: req.user._id,
    });
    await newTask.save();
    res.status(201).json({
      ...newTask._doc,
      dueDate: formatDate(newTask.dueDate),
    });
  } catch (err) {
    handleError(res, 500, 'Error creating task', err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const updateData = {
      title,
      description,
      status,
      ...(dueDate && { dueDate: new Date(dueDate) }), 
    };
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });
    res.status(200).json({
      ...task._doc,
      dueDate: formatDate(task.dueDate),
    });
  } catch (err) {
    handleError(res, 500, 'Error updating task', err);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    handleError(res, 500, 'Error deleting task', err);
  }
};