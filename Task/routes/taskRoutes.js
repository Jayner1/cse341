const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);

module.exports = router;
