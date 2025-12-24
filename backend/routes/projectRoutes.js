const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.get('/',async (req , res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const project = new Project({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
    });
    try {
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    } 
});

module.exports = router;