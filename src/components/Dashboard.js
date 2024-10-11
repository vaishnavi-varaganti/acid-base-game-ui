import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import acid from '../assets/acid.png'; 
import base from '../assets/base.png'; 
import reaction from '../assets/reaction.png'; 
import axios from 'axios';
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  const downloadReport = async () => {
    try {
      const response = await axios.get('https://api-generator.retool.com/R5pZpT/gamedetails');
      const data = response.data;
      const formattedData = data.map(item => [
        item.Firstname,
        item.Lastname,
        item.SID,
        item.Level_1_Score,
        item.Level_2_Score,
        item.Level_3_Score,
        item.Level_4_Score,
        parseInt(item.Level_1_Score) + parseInt(item.Level_2_Score) + parseInt(item.Level_3_Score) + parseInt(item.Level_4_Score)
      ]);
      const headers = ['FirstName', 'LastName', 'SID', 'Level 1 Score', 'Level 2 Score', 'Level 3 Score', 'Level 4 Score', 'Total'];
      formattedData.unshift(headers);
      const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
      XLSX.writeFile(workbook, 'GameReport.xlsx');
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div className="dashboard">
      <button className="users-btn" onClick={() => navigate('/users')}>
        + Users
      </button>
      <button className="download-btn" onClick={downloadReport}>
        Download Report
      </button>
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