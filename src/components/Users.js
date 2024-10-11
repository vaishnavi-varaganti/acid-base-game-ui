import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState('');
  const [storedPassword, setStoredPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://api-generator.retool.com/ocWM6W/usercredentials');
      setUsers(response.data);
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
    setStoredPassword(user.Password || ''); // Store the existing password but do not show it in the UI.
    setIsEditModalOpen(true);
  };

  const handleAddUser = async () => {
    try {
      await axios.post('https://api-generator.retool.com/ocWM6W/usercredentials', {
        Email: email,
        Password: 'sample123',
      });
      toast.success('User added successfully');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Error adding user');
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(`https://api-generator.retool.com/ocWM6W/usercredentials/${selectedUser.id}`, {
        Email: email,
        Password: storedPassword, // Use the stored password during the PUT operation.
      });
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Users</h2>
        <div className="search-add">
          <input
            type="text"
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          {users
            .filter((user) => user.Email.toLowerCase().includes(search.toLowerCase()))
            .map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.Email}</td>
                <td>
                  <FaEdit
                    className="action-icon edit-icon"
                    onClick={() => handleEdit(user)}
                  />
                  <FaTrash
                    className="action-icon delete-icon"
                    onClick={() => confirmDelete(user)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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