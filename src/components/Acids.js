import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Acids.css';
import { BsTrash, BsPencil } from 'react-icons/bs';

const Acids = () => {
  const [acids, setAcids] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAcid, setSelectedAcid] = useState(null);
  const [acidToEdit, setAcidToEdit] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // For adding acid
  const [newAcid, setNewAcid] = useState(''); // To track the new acid name
  const [errorMessage, setErrorMessage] = useState(''); // To show error message

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
        setSelectedForDelete(null);
      })
      .catch(error => {
        console.error('Error deleting acid:', error);
      });
  };

  const handleSelectForDelete = (acid) => {
    if (selectedForDelete === acid.id) {
      handleDelete(acid.id);
    } else {
      setSelectedForDelete(acid.id);
    }
  };

  const handleEdit = (acid) => {
    if (selectedAcid === acid.id) {
      setShowModal(true);
    } else {
      setSelectedAcid(acid.id);
      setAcidToEdit(acid.Compound);
    }
  };

  const handleUpdateAcid = () => {
    const updatedAcid = { Compound: acidToEdit };

    axios.put(`https://api-generator.retool.com/tnFVDY/acidsbases/${selectedAcid}`, updatedAcid)
      .then(() => {
        setAcids(acids.map(acid => acid.id === selectedAcid ? { ...acid, Compound: acidToEdit } : acid));
        setShowModal(false);
        setSelectedAcid(null);
      })
      .catch(error => {
        console.error('Error updating acid:', error);
      });
  };

  // Add new acid
  const handleAddAcid = () => {
    // Check if the acid already exists
    const acidExists = acids.some(acid => acid.Compound.toLowerCase() === newAcid.toLowerCase());

    if (acidExists) {
      setErrorMessage('Acid already exists!');
      return;
    }

    const newAcidData = {
      Compound: newAcid,
      Type: 'Acid'
    };

    axios.post('https://api-generator.retool.com/tnFVDY/acidsbases', newAcidData)
      .then((response) => {
        setAcids([...acids, response.data]); // Add the new acid to the list
        setShowAddModal(false); // Close the modal
        setNewAcid(''); // Reset input
        setErrorMessage(''); // Clear error
      })
      .catch(error => {
        console.error('Error adding acid:', error);
      });
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
              setEditMode(false);
              setSelectedForDelete(null);
              setSelectedAcid(null);
            }}
          >
            {deleteMode ? 'Cancel' : 'Delete Acid'}
          </button>
          <button
            className={`btn btn-warning ${editMode ? 'active' : ''}`}
            onClick={() => {
              setEditMode(!editMode);
              setDeleteMode(false);
              setSelectedAcid(null);
              setSelectedForDelete(null);
            }}
          >
            {editMode ? 'Cancel' : 'Edit Acid'}
          </button>
        </div>
      </div>

      <div className="acids-grid">
        {acids.map((acid, index) => (
          <div
            key={index}
            className={`acid-card
              ${deleteMode && 'highlight-for-delete'}
              ${editMode && 'highlight-for-edit'}
              ${selectedForDelete === acid.id && deleteMode ? 'selected-for-delete' : ''}
              ${selectedAcid === acid.id && editMode ? 'selected-for-edit' : ''}`}
            onClick={() => {
              if (deleteMode) handleSelectForDelete(acid);
              if (editMode) handleEdit(acid);
            }}
          >
            {selectedForDelete === acid.id && deleteMode ? (
              <BsTrash className="trash-icon" />
            ) : selectedAcid === acid.id && editMode ? (
              <BsPencil className="pencil-icon" />
            ) : (
              <h3>{acid.Compound}</h3>
            )}
          </div>
        ))}
        <div className="add-acid" onClick={() => setShowAddModal(true)}>
          <h3>+</h3>
        </div>
      </div>

      {/* Edit Acid Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Acid</h3>
            <input
              type="text"
              value={acidToEdit}
              onChange={(e) => setAcidToEdit(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleUpdateAcid}>Update</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add Acid Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Acid</h3>
            <input
              type="text"
              value={newAcid}
              onChange={(e) => setNewAcid(e.target.value)}
              placeholder="Enter acid name"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="btn btn-primary" onClick={handleAddAcid}>Add</button>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Acids;