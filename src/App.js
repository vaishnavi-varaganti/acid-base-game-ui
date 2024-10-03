import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from '../src/components/Navbar';
import Header from './components/Header';
// import Login from './Login';
import Dashboard from '../src/components/Dashboard';
// import AcidsList from './AcidsList';
// import BasesList from './BasesList';
// import ReactionsList from './ReactionsList';
// import Results from './Results';

function App() {
  return (
    <Router>
       <Header /> 
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
