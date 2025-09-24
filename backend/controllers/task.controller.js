const taskService = require('../services/task.service');

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const taskData = { title, description, deadline };

    if (req.file) {
      taskData.linkedFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const task = await taskService.createTask(taskData);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.linkedFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }
    const task = await taskService.updateTask(req.params.id, updates);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task || !task.linkedFile) return res.status(404).json({ error: 'File not found' });

    res.set({
      'Content-Type': task.linkedFile.contentType,
      'Content-Disposition': `attachment; filename="${task.linkedFile.filename}"`
    });
    res.send(task.linkedFile.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
