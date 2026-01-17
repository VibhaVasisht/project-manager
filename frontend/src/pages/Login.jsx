import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        try{
            const data = await loginUser(form);
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            const navigate = useNavigate();
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return(
        <>
        <form onSubmit={submitHandler}>
            <input placeholder='Email' onChange={(e) => setForm({ ...form, email: e.target.value})} />
            <input type='password' placeholder='Password' onChange={(e) => setForm({ ...form, password: e.target.value})} />
            <button type='submit'>Login</button>
        </form>
        
         <p>
        Don't have an account? <a href="/register">Register here</a>.
        </p>
        </>
    );
}
