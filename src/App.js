import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Acids from './components/Acids';
import Users from './components/Users';
import Reports from './components/Reports';
import Bases from './components/Bases';
import Reactions from './components/Reactions';
import ProtectedRoute from './components/ProtectedRoute';
import Neither from './components/Neither';

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/acids" element={<ProtectedRoute element={<Acids />} />} />
        <Route path="/users" element={<ProtectedRoute element={<Users />} />} />
        <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
        <Route path="/bases" element={<ProtectedRoute element={<Bases />} />} />
        <Route path="/reactions" element={<ProtectedRoute element={<Reactions />} />} />
        <Route path="/neither" element={<ProtectedRoute element={<Neither />} />} />
      </Routes>
    </Router>
  );
}

export default App;