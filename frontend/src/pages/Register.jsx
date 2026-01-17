import { useState } from 'react';
import { registerUser } from '../api/auth';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        const data = await registerUser(form);

        localStorage.setItem('token', data.token);
        alert('Registration successful!');
        window.location.href = '/dashboard';
    };

    return(
        <>
        <form onSubmit={submitHandler}>
            <input placeholder='Name' onChange={(e) => setForm({ ...form, name: e.target.value})} />
            <input placeholder='Email' onChange={(e) => setForm({ ...form, email: e.target.value})} />
            <input type='password' placeholder='Password' onChange={(e) => setForm({ ...form, password: e.target.value})} />
            <button type='submit'>Register</button>
        </form>
        <p>
        Already have an account? <a href="/">Login here</a>.
        </p>
        </>
    );
}
