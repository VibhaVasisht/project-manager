import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { refreshUser } = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(form);
            localStorage.setItem('token', data.token);
            await refreshUser();
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return(
        <div className="app-container">
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <input 
                            type="email"
                            placeholder='Email' 
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value})} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type='password' 
                            placeholder='Password' 
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value})} 
                            required
                        />
                    </div>
                    <button type='submit' className="btn">Login</button>
                </form>
                <div className="link">
                    <p>Don't have an account? <a href="/register">Register here</a>.</p>
                </div>
            </div>
        </div>
    );
}
