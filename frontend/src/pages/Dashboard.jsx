import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProjects, createProject } from "../api/project";
import { getTasks, createTask, updateTask } from "../api/task";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, tasksRes] = await Promise.all([getProjects(), getTasks()]);
            setProjects(projectsRes);
            setTasks(tasksRes);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await createProject(newProject);
            setNewProject({ name: '', description: '' });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask(newTask);
            setNewTask({ title: '', description: '', projectId: '' });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            await updateTask(taskId, { status: newStatus });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Not Started': return 'status-not-started';
            case 'In Progress': return 'status-in-progress';
            case 'Completed': return 'status-completed';
            default: return '';
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="app-container">
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Welcome, {user.name}!</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>

                <div className="content-grid">
                    <div className="section">
                        <h2>Projects</h2>
                        <ul className="project-list">
                            {projects.map(project => (
                                <li key={project._id} className="project-item">
                                    <h3>{project.name}</h3>
                                    <p>{project.description}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="create-form">
                            <h3>Create New Project</h3>
                            <form onSubmit={handleCreateProject}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Project Name"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        placeholder="Description"
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn">
                                    Create Project
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Tasks</h2>
                        <ul className="task-list">
                            {tasks.map(task => (
                                <li key={task._id} className="task-item">
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <div>
                                        <label>Status: </label>
                                        <select 
                                            value={task.status} 
                                            onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="Not Started">Not Started</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="create-form">
                            <h3>Create New Task</h3>
                            <form onSubmit={handleCreateTask}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Task Title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        placeholder="Description"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <select
                                        value={newTask.projectId}
                                        onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map(project => (
                                            <option key={project._id} value={project._id}>{project.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn">
                                    Create Task
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}