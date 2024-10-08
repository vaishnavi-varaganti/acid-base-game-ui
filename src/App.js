import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from '../src/components/Navbar';
import Header from './components/Header';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from '../src/components/Dashboard';
import Acids from '../src/components/Acids';
// import BasesList from './BasesList';
// import ReactionsList from './ReactionsList';
// import Results from './Results';

function App() {
  return (
    <Router>
       <Header /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/acids" element={<Acids />} />
      </Routes>
    </Router>
  );
}

export default App;
