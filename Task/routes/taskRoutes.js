const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskValidation, validateTaskId, handleValidationErrors } = require('../validation/taskValidation'); 

// GET all tasks
router.get('/', taskController.getTasks);

// GET a task by ID
router.get('/:id', validateTaskId, handleValidationErrors, taskController.getTaskById);

// POST a new task
router.post('/', taskValidation, handleValidationErrors, taskController.createTask);

// PUT to update a task
router.put('/:id', validateTaskId, taskValidation, handleValidationErrors, taskController.updateTask);

// DELETE a task
router.delete('/:id', validateTaskId, handleValidationErrors, taskController.deleteTask);

module.exports = router;
