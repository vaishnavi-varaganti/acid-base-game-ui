import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      toast.error('Please enter both email and password.');
      return;
    }
  
    try {
      const response = await axios.get('https://api-generator.retool.com/ocWM6W/usercredentials');
      const user = response.data.find(
        (user) =>
          user.Email.toLowerCase() === email.toLowerCase() &&
          user.Password === password
      );
  
      if (user) {
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000); 
      }else {
        setError('Invalid email or password.');
        toast.error('Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again later.');
      toast.error('An error occurred. Please try again later.');
    }
  
    setLoading(false);
  };

  return (
    <div className="login-form-container">
      <h1>LOGIN</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
        </div>
        <div className="form-options">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handleShowPasswordToggle}
            />
            Show Password
          </label>
          <Link to="/forgotpassword" className="forgot-password">Forgot Password?</Link>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;