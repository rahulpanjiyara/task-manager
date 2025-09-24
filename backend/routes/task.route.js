const express = require('express');
const multer = require('multer');
const taskController = require('../controllers/task.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.put('/:id', upload.single('file'), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/:id/file', taskController.downloadFile);

module.exports = router;
