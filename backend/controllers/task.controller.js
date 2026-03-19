import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
  const { title, description, dueDate, projectId } = req.body;
  const task = new Task({
    title,
    description,
    dueDate,
    projectId,
    owner: req.user._id.toString(),
  });
  const savedTask = await task.save();
  res.status(201).json(savedTask);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};
export const getTasks = async (req, res) => {
    try {
  const tasks = await Task.find({ owner: req.user._id.toString() });
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
  if (task.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(task);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
export const updateTask = async (req, res) => {
    try {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (task.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );    
    res.json(updatedTask);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};  
export const deleteTask = async (req, res) => {
    try {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (task.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
