import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from '../src/components/Dashboard';
import Acids from '../src/components/Acids';
import Users from '../src/components/Users';
import Reports from '../src/components/Reports';
import Bases from '../src/components/Bases';
import Reactions from '../src/components/Reactions';

function App() {
  return (
    <Router>
       <Header /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/acids" element={<Acids />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/bases" element={<Bases />} />
        <Route path="/reactions" element={<Reactions />} />
      </Routes>
    </Router>
  );
}

export default App;
