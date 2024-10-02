import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import acid from '../assets/acid.png'; 
import base from '../assets/base.png'; 
import reaction from '../assets/reaction.png'; 

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <div className="card acids" onClick={() => handleCardClick('/acids')}>
        <div className="card-content">
          <h3>ACIDS</h3>
          <img src={acid} alt='Acid' className="card-image" />
        </div>
      </div>

      <div className="card bases" onClick={() => handleCardClick('/bases')}>
        <div className="card-content">
          <h3>BASES</h3>
          <img src={base} alt='Base' className="card-image" />
        </div>
      </div>

      <div className="card reactions" onClick={() => handleCardClick('/reactions')}>
        <div className="card-content">
          <h3>REACTIONS</h3>
          <img src={reaction} alt='Reaction' className="card-image" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;