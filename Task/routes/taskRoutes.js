const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskValidation, validateTaskId, handleValidationErrors } = require('../validation/taskValidation');

router.get('/', taskController.getTasks); 

router.get('/:id', validateTaskId, handleValidationErrors, taskController.getTaskById);

router.post('/', taskValidation, handleValidationErrors, taskController.createTask);

router.put('/:id', validateTaskId, taskValidation, handleValidationErrors, taskController.updateTask);

router.delete('/:id', validateTaskId, handleValidationErrors, taskController.deleteTask);

module.exports = router;