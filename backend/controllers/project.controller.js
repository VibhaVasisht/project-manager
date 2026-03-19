import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
    try {
  const { name, description, deadline } = req.body;
  const project = new Project({
    name,
    description,
    deadline,
    owner: req.user._id.toString(),
  });
  const savedProject = await project.save();
  res.status(201).json(savedProject);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};
export const getProjects = async (req, res) => {
    try {
  const projects = await Project.find({ owner: req.user._id.toString() });
  res.json(projects);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
export const getProjectById = async (req, res) => {
    try {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  res.json(project);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

export const updateProject = async (req, res) => {
    try {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );    
    if (!updatedProject) {
    return res.status(404).json({ message: "Project not found" });
    }
    res.json(updatedProject);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};

export const deleteProject = async (req, res) => {
    try {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  // Delete all tasks associated with this project
  await Task.deleteMany({ projectId: req.params.id, owner: req.user._id.toString() });
  await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project and associated tasks deleted" });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
