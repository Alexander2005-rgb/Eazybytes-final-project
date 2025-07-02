import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Login failed');
        return;
      }

      const data = await response.json();
      login(data.user, data.token);
      setSuccess('Login successful');
      setError('');
      // Optionally redirect or show success message here
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-card1">
      <h2 className="auth-title">Login</h2>
      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="auth-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
