import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import CryptoJS from 'crypto-js';

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
      const response = await axios.get(`https://api-generator.retool.com/ocWM6W/usercredentials?Email=${email}`);
      const user = response.data;
      const decryptedPassword = decryptStringFromBytes(user[0].Password);
      if (decryptedPassword.trim() === password.trim()) {
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); 
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


  const decryptStringFromBytes = (cipherText) => {

    const key = process.env.REACT_APP_CIPHER_KEY;

    if (!cipherText || cipherText.length <= 0) {
        throw new Error('cipherText cannot be null or empty.');
    }
    if (!key || key.length <= 0) {
        throw new Error('Key cannot be null or empty.');
    }

    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse(key);

    try {
        const decrypted = CryptoJS.AES.decrypt(cipherText, keyBytes, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return 'keyError';
    }
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
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default Login;