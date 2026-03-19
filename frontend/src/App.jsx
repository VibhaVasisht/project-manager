import { useState, useEffect } from 'react';

export default function App() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '' });
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
    const [view, setView] = useState('login');

    const API_BASE = 'http://localhost:5000';

    const apiRequest = async (endpoint, options = {}) => {
        const currentToken = localStorage.getItem('token') || token;
        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
                ...options.headers,
            },
            ...options,
        });
        if (!res.ok) throw new Error('API error');
        return res.json();
    };

    const login = async () => {
        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(loginForm),
            });
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setUser(data);
            setProjects([]); // Clear previous user's data
            setTasks([]); // Clear previous user's data
            setView('dashboard');
            fetchData();
        } catch (err) {
            alert('Login failed');
        }
    };

    const register = async () => {
        try {
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(registerForm),
            });
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setUser(data);
            setProjects([]); // Clear any cached data
            setTasks([]); // Clear any cached data
            setView('dashboard');
            fetchData();
        } catch (err) {
            alert('Registration failed');
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        setProjects([]); // Clear data on logout
        setTasks([]); // Clear data on logout
        localStorage.removeItem('token');
        setView('login');
    };

    const fetchData = async () => {
        try {
            const [proj, tsk] = await Promise.all([
                apiRequest('/projects'),
                apiRequest('/tasks'),
            ]);
            setProjects(proj);
            setTasks(tsk);
        } catch (err) {
            console.error('Failed to fetch data');
        }
    };

    const createProject = async () => {
        try {
            await apiRequest('/projects', {
                method: 'POST',
                body: JSON.stringify(newProject),
            });
            setNewProject({ name: '', description: '' });
            fetchData();
        } catch (err) {
            alert('Failed to create project');
        }
    };

    const createTask = async () => {
        try {
            await apiRequest('/tasks', {
                method: 'POST',
                body: JSON.stringify(newTask),
            });
            setNewTask({ title: '', description: '', projectId: '' });
            fetchData();
        } catch (err) {
            alert('Failed to create task');
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            await apiRequest(`/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
            });
            fetchData();
        } catch (err) {
            alert('Failed to update task');
        }
    };

    const deleteProject = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) return;
        try {
            await apiRequest(`/projects/${projectId}`, {
                method: 'DELETE',
            });
            fetchData();
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const deleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await apiRequest(`/tasks/${taskId}`, {
                method: 'DELETE',
            });
            fetchData();
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    useEffect(() => {
        if (token) {
            apiRequest('/auth/me')
                .then(setUser)
                .then(() => {
                    setView('dashboard');
                    fetchData();
                })
                .catch(() => {
                    setToken('');
                    localStorage.removeItem('token');
                });
        }
    }, []);

    if (view === 'login') {
        return (
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: '#333' }}>
                <div style={{ maxWidth: '400px', margin: '50px auto', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <h2>Login</h2>
                    <input placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} autoComplete="off" />
                    <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} autoComplete="off" />
                    <button onClick={login} style={{ width: '100%', padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
                    <p style={{ textAlign: 'center', margin: '20px 0' }}><button onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer' }}>Register</button></p>
                </div>
            </div>
        );
    }

    if (view === 'register') {
        return (
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: '#333' }}>
                <div style={{ maxWidth: '400px', margin: '50px auto', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <h2>Register</h2>
                    <input placeholder="Name" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} autoComplete="off" />
                    <input placeholder="Email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} autoComplete="off" />
                    <input type="password" placeholder="Password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} autoComplete="off" />
                    <button onClick={register} style={{ width: '100%', padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
                    <p style={{ textAlign: 'center', margin: '20px 0' }}><button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer' }}>Login</button></p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: '#333' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1>Welcome, {user?.name}!</h1>
                    <button onClick={logout} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                        <h2>Projects</h2>
                        {projects.map(p => (
                            <div key={p._id} style={{ padding: '15px', margin: '10px 0', background: '#f8f9fa', borderRadius: '5px', position: 'relative' }}>
                                <h3>{p.name}</h3>
                                <p>{p.description}</p>
                                <button onClick={() => deleteProject(p._id)} style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                            </div>
                        ))}
                        <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>
                            <h3>Create Project</h3>
                            <input placeholder="Name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} />
                            <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px', height: '60px' }} />
                            <button onClick={createProject} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create</button>
                        </div>
                    </div>

                    <div>
                        <h2>Tasks</h2>
                        {tasks.map(t => (
                            <div key={t._id} style={{ padding: '15px', margin: '10px 0', background: '#f8f9fa', borderRadius: '5px', position: 'relative' }}>
                                <h3>{t.title}</h3>
                                <p>{t.description}</p>
                                <select value={t.status} onChange={e => updateTaskStatus(t._id, e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <button onClick={() => deleteTask(t._id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                            </div>
                        ))}
                        <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>
                            <h3>Create Task</h3>
                            <input placeholder="Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} />
                            <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px', height: '60px' }} />
                            <select value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }}>
                                <option value="">Select Project</option>
                                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <button onClick={createTask} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}