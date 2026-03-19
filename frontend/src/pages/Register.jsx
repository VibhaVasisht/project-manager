import { useState } from 'react';
import { registerUser } from '../api/auth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const { refreshUser } = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const data = await registerUser(form);
            localStorage.setItem('token', data.token);
            await refreshUser();
            window.location.href = '/dashboard';
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    };

    return(
        <div className="app-container">
            <div className="form-container">
                <h2>Register</h2>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <input 
                            type="text"
                            placeholder='Name' 
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value})} 
                            required
                        />
                    </div>
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
                    <button type='submit' className="btn">Register</button>
                </form>
                <div className="link">
                    <p>Already have an account? <a href="/">Login here</a>.</p>
                </div>
            </div>
        </div>
    );
}
