import Project from "../models/Project.js";

export const createProject = async (req, res) => {
    try {
  const { name, description, deadline } = req.body;
  const project = new Project({
    name,
    description,
    deadline,
    owner: req.user._id,
  });
  const savedProject = await project.save();
  res.status(201).json(savedProject);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};
export const getProjects = async (req, res) => {
    try {
  const projects = await Project.find({ owner: req.user._id });
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
  res.json(project);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

export const updateProject = async (req, res) => {
    try {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );    
    if (!project) {
    return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
} catch (error) {
  res.status(400).json({ message: error.message });
}
};

export const deleteProject = async (req, res) => {
    try {
  const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
    return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted" });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};
