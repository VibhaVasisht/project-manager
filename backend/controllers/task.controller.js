import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
  const { title, description, dueDate, projectId } = req.body;
  const task = new Task({
    title,
    description,
    dueDate,
    projectId,
    owner: req.user._id,
  });
  const savedTask = await task.save();
  res.status(201).json(savedTask);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};
export const getTasks = async (req, res) => {
    try {
  const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
export const getTaskById = async (req, res) => {
    try {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
export const updateTask = async (req, res) => {
    try {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );    
    if (!task) {
    return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};  
export const deleteTask = async (req, res) => {
    try {
  const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
    return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
