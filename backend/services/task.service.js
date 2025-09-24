const Task = require('../models/Task');

exports.createTask = async (taskData) => {
  const task = new Task(taskData);
  return await task.save();
};

exports.getAllTasks = async () => {
  return await Task.find().sort({ createdOn: -1 });
};

exports.getTaskById = async (id) => {
  return await Task.findById(id);
};

exports.updateTask = async (id, updates) => {
  return await Task.findByIdAndUpdate(id, updates, { new: true });
};

exports.deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};
