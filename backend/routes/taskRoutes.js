const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/',async (req , res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        projectId: req.body.projectId,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        status: req.body.status
    });
    try {
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    } 
});

module.exports = router;