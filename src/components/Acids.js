import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import './Acids.css';
import { BsTrash } from 'react-icons/bs'; 

const Acids = () => {
  const [acids, setAcids] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false); 
  const [selectedAcid, setSelectedAcid] = useState(null); 

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

  const handleDelete = (acidId) => {
    axios.delete(`https://api-generator.retool.com/tnFVDY/acidsbases/${acidId}`)
      .then(() => {
        setAcids(acids.filter(acid => acid.id !== acidId)); 
      })
      .catch(error => {
        console.error('Error deleting acid:', error);
      });
  };

  const handleSelectForDelete = (acid) => {
    if (selectedAcid === acid.id) {
      handleDelete(acid.id);
      setSelectedAcid(null);
    } else {
      setSelectedAcid(acid.id);
    }
  };

  return (
    <div className="acids-container">
      <div className="header-row">
        <h2>ACIDS</h2>
        <div className="action-buttons">
          <button 
            className={`btn btn-danger ${deleteMode ? 'active' : ''}`} 
            onClick={() => {
              setDeleteMode(!deleteMode);
              setSelectedAcid(null); // Clear selected acid when toggling delete mode
            }}
          >
            {deleteMode ? 'Cancel' : 'Delete Acid'} {/* Button text changes based on deleteMode */}
          </button>
          <button className="btn btn-warning">Edit Acid</button>
        </div>
      </div>
      <div className="acids-grid">
        {acids.map((acid, index) => (
          <div 
            key={index} 
            className={`acid-card ${deleteMode && 'highlight-for-delete'} ${selectedAcid === acid.id ? 'selected-for-delete' : ''}`} 
            onClick={() => deleteMode && handleSelectForDelete(acid)}
          >
            {selectedAcid === acid.id ? <BsTrash className="trash-icon" /> : <h3>{acid.Compound}</h3>}
          </div>
        ))}
        <div className="add-acid">
          <h3>+</h3>
        </div>
      </div>
    </div>
  );
};

export default Acids;