import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import acid from '../assets/acid.png'; 
import base from '../assets/base.png'; 
import neither from '../assets/neither.png'; 
import reaction from '../assets/reaction.png'; 

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };  

  const handleReports = () => {
    navigate('/reports');
  };

  return (
    <div className="dashboard">
      <button className="users-btn" onClick={() => navigate('/users')}>
        Users
      </button>
      <button className="download-btn" onClick={handleReports}>
        Report
      </button>
      
      <div className="card acids" onClick={() => handleCardClick('/acids')}>
        <div className="card-content">
          <h3>ACIDS</h3>
          <img src={acid} alt="Acid" className="card-image" />
        </div>
      </div>

      <div className="card bases" onClick={() => handleCardClick('/bases')}>
        <div className="card-content">
          <h3>BASES</h3>
          <img src={base} alt="Base" className="card-image" />
        </div>
      </div>

      <div className="card neither" onClick={() => handleCardClick('/neither')}>
        <div className="card-content">
          <h3>NEITHER</h3>
          <img src={neither} alt="Neither" className="card-image" />
        </div>
      </div>

      <div className="card reactions" onClick={() => handleCardClick('/reactions')}>
        <div className="card-content">
          <h3>REACTIONS</h3>
          <img src={reaction} alt="Reaction" className="card-image" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;