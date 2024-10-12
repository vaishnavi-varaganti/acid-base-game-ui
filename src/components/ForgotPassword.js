import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [cond1, setCond1] = useState(false);
  const [cond2, setCond2] = useState(false);
  const [cond3, setCond3] = useState(false);
  const [cond4, setCond4] = useState(false);
  const [cond5, setCond5] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setCond1(value.length >= 6);
    setCond2(/[A-Z]/.test(value));
    setCond3(/[a-z]/.test(value));
    setCond4(/[!@#$%^&*(),.?":{}|<>]/.test(value));
    setCond5(/\d/.test(value));
    setError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setError('');
  };

  const handleShowPasswordsToggle = () => {
    setShowPasswords(!showPasswords);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmNewPassword) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    if (!(cond1 && cond2 && cond3 && cond4 && cond5)) {
      setError('Password does not meet the required criteria.');
      toast.error('Password does not meet the required criteria.');
      return;
    }

    try {
      const response = await axios.get('https://api-generator.retool.com/ocWM6W/usercredentials');
      const user = response.data.find((user) => user.Email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError('Email not found.');
        toast.error('Email not found.');
        return;
      }

      await axios.put(`https://api-generator.retool.com/ocWM6W/usercredentials/${user.id}`, {
        Email: email,
        Password: encryptStringToBytesAES(newPassword),
      });

      toast.success('Password updated successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1000); 
    } catch (error) {
      console.error('Error updating password:', error);
      setError('An error occurred. Please try again later.');
      toast.error('An error occurred. Please try again later.');
    }
  };

  const encryptStringToBytesAES = (plainText) => {

    const key = process.env.REACT_APP_CIPHER_KEY;

    if (!plainText || plainText.length <= 0) {
        throw new Error('plainText cannot be null or empty.');
    }
    if (!key || key.length <= 0) {
        throw new Error('Key cannot be null or empty.');
    }

    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse(key);

    const encrypted = CryptoJS.AES.encrypt(plainText, keyBytes, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};


  return (
    <div className="forgot-password-form-container">
      <h1>Reset Password</h1>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
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
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
          />
        </div>
        <div className="form-group">
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmNewPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm New Password"
          />
        </div>
        <div className="form-options">
          <label>
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={handleShowPasswordsToggle}
            />
            Show Passwords
          </label>
        </div>

        <div className='password-rules'>
          <ul style={{ listStyleType: "none", fontSize: "small", textAlign: "left" }}>
            <li className={cond1 ? "text-success" : "text-danger"}>
              {cond1 ? '✔' : '✖'} At least 6 characters long.
            </li>
            <li className={cond2 ? "text-success" : "text-danger"}>
              {cond2 ? '✔' : '✖'} At least one Uppercase Alphabet.
            </li>
            <li className={cond3 ? "text-success" : "text-danger"}>
              {cond3 ? '✔' : '✖'} At least one Lowercase Alphabet.
            </li>
            <li className={cond4 ? "text-success" : "text-danger"}>
              {cond4 ? '✔' : '✖'} At least one Special Character.
            </li>
            <li className={cond5 ? "text-success" : "text-danger"}>
              {cond5 ? '✔' : '✖'} At least one Digit.
            </li>
          </ul>
        </div>

        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button type="submit" className="submit-button">
            Reset Password
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default ForgotPassword;