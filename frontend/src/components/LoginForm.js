import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const response = await fetch('https://dishu-1gg7.onrender.com/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setMessage('Login successful!');
          console.log('User logged in:', data.user);
        } else {
          setMessage(data.message || 'Login failed');
        }
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await fetch('https://dishu-1gg7.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setMessage('Registration successful!');
          console.log('User registered:', data.user);
        } else {
          setMessage(data.message || 'Registration failed');
        }
      } else if (mode === 'forgot') {
        // For now, just show a message. In a real app, you'd implement password reset
        setMessage('Password reset functionality not implemented yet');
        setMode('login');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'forgot') {
      return (
        <>
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="login-btn">Send Reset Link</button>
          </form>
          <div className="login-footer">
            <a href="#" onClick={() => setMode('login')}>Back to Login</a>
          </div>
        </>
      );
    }

    return (
      <>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p>{mode === 'login' ? 'Please sign in to your account' : 'Sign up to get started'}</p>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {mode === 'signup' && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
          {message && <p className="message">{message}</p>}
        </form>
        <div className="login-footer">
          <a href="#" onClick={() => setMode('forgot')}>Forgot password?</a>
          <span> | </span>
          <a href="#" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </a>
        </div>
      </>
    );
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {renderForm()}
      </div>
    </div>
  );
}

export default LoginForm;
