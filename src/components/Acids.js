import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios
import './Acids.css';

const Acids = () => {
  const [acids, setAcids] = useState([]);
  useEffect(() => {
    axios.get('https://retoolapi.dev/tnFVDY/acidsbases')
      .then((response) => {
        const acidsData = response.data.filter(item => item.Type === "Acid");
        setAcids(acidsData);  
      })
      .catch((error) => {
        console.error('Error fetching acids:', error);  
      });
  }, []);

  return (
    <div className="acids-container">
      <h2>ACIDS</h2>
      <div className="acids-grid">
        {acids.map((acid, index) => (
          <div key={index} className="acid-card">
            <h3>{acid.Compound}</h3>
          </div>
        ))}
        <div className="add-acid ">
          <h3>+</h3>
        </div>
      </div>
    </div>
  );
};

export default Acids;