const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

module.exports = mongoose.model('Task', taskSchema);
