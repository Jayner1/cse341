const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks
 *     responses:
 *       200:
 *         description: Successfully fetched tasks
 *       401:
 *         description: Unauthorized access
 *     security:
 *       - apiKey: []
 */
router.get('/', taskController.getTasks);

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
router.get('/:id', taskController.getTaskById);

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
 *                 description: The title of the task
 *               description:
 *                 type: string
 *                 description: Detailed description of the task
 *               completed:
 *                 type: boolean
 *                 description: Indicates whether the task is completed
 *     responses:
 *       201:
 *         description: Task successfully created
 *       400:
 *         description: Invalid input
 *     security:
 *       - apiKey: []
 */
router.post('/', taskController.createTask);

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
 *               completed:
 *                 type: boolean
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
router.put('/:id', taskController.updateTask);

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
router.delete('/:id', taskController.deleteTask);

module.exports = router;
