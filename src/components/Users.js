import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './Users.css';
import emailjs from '@emailjs/browser';
import CryptoJS from 'crypto-js';
import confetti from 'canvas-confetti';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [page, setPage] = useState(1);
  const recordsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter((user) =>
      user.Email.toLowerCase().includes(search.toLowerCase())
    );
    setTotalPages(Math.ceil(filteredUsers.length / recordsPerPage));
  }, [users, search]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://api-generator.retool.com/ocWM6W/usercredentials');
      setUsers(response.data);
      setTotalPages(Math.ceil(response.data.length / recordsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://api-generator.retool.com/ocWM6W/usercredentials/${selectedUser.id}`);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEmail(user.Email);
    setStoredPassword(user.Password || '');
    setIsEditModalOpen(true);
  };

  const handleAddUser = async () => {
    const tempPassword = generateRandomPassword();
    const encryptedPassword = encryptStringToBytesAES(tempPassword)
    try {
      await axios.post('https://api-generator.retool.com/ocWM6W/usercredentials', {
        Email: email,
        Password: encryptedPassword,
      });
      toast.success('User added successfully');
      sendWelcomeEmail(email, tempPassword);
      setIsModalOpen(false);
      triggerConfetti();
      fetchUsers();
    } catch (error) {
      toast.error('Error adding user');
      console.error('Error adding user:', error);
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

  const sendWelcomeEmail = (userEmail, tempPassword) => {
    const templateParams = {
      recipient: userEmail,
      to_name: userEmail.split('@')[0],
      temp_password: tempPassword,
    };

    emailjs.send('service_9gqt8y6', 'template_wco48qs', templateParams, '6cI_R7op59lEst987')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        toast.success('Welcome email sent successfully');
      })
      .catch((error) => {
        console.error('FAILED...', error);
        toast.error('Failed to send welcome email');
      });
  };

  const generateRandomPassword = (length = 10) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const triggerConfetti = () => {
    const duration = 1 * 1000;
    const end = Date.now() + duration;
    const vibrantColors = ['#FF6347', '#FF4500', '#FFD700', '#ADFF2F', '#00CED1', '#1E90FF', '#9932CC', '#FF69B4'];
    const frame = () => {
      confetti({
        particleCount: 7,
        startVelocity: 30,
        spread: 360,
        ticks: 200,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.2
        },
        gravity: 0.7,
        scalar: 1.2,
        colors: vibrantColors
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const paginatedUsers = users
    .filter((user) => user.Email.toLowerCase().includes(search.toLowerCase()))
    .slice((page - 1) * recordsPerPage, page * recordsPerPage);

    const handleEditUser = async () => {
      try {
        await axios.put(`https://api-generator.retool.com/ocWM6W/usercredentials/${selectedUser.id}`, {
          Email: email,
          Password: storedPassword,
        });
        toast.success('User updated successfully');
        setIsEditModalOpen(false);
        fetchUsers();
      } catch (error) {
        toast.error('Error updating user');
        console.error('Error updating user:', error);
      }}; 
  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Users</h2>
        <div className="search-add">
          <input
            type="text"
            placeholder="Search by email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button onClick={() => setIsModalOpen(true)}>+ Add User</button>
        </div>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{(page - 1) * recordsPerPage + index + 1}</td>
              <td>{user.Email}</td>
              <td>
                <FaEdit className="action-icon edit-icon" onClick={() => handleEdit(user)} />
                <FaTrash className="action-icon delete-icon" onClick={() => confirmDelete(user)} />
              </td>
            </tr>
          ))}
        </tbody>
    </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add User</h3>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddUser}>Add</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <input
              type="email"
              placeholder="Edit email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleEditUser}>Update</button>
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-buttons">
              <button onClick={handleDelete}>Delete</button>
              <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Users;