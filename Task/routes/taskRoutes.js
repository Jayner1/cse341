const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskValidation, validateTaskId, handleValidationErrors } = require('../validation/taskValidation');  // Import validation logic

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Add a new task to the task list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: ['pending', 'in-progress', 'completed']
 *     responses:
 *       201:
 *         description: Task successfully created
 *       400:
 *         description: Invalid input
 *     security:
 *       - apiKey: []
 */
router.post('/', taskValidation, handleValidationErrors, taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Modify an existing task by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ['pending', 'in-progress', 'completed']
 *     responses:
 *       200:
 *         description: Task successfully updated
 *       404:
 *         description: Task not found
 *       400:
 *         description: Invalid input
 *     security:
 *       - apiKey: []
 */
router.put('/:id', taskValidation, handleValidationErrors, taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     description: Retrieve a task by its unique ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Successfully fetched task by ID
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized access
 *     security:
 *       - apiKey: []
 */
router.get('/:id', validateTaskId, handleValidationErrors, taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Remove a task by its ID from the list
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized access
 *     security:
 *       - apiKey: []
 */
router.delete('/:id', validateTaskId, handleValidationErrors, taskController.deleteTask);

module.exports = router;
