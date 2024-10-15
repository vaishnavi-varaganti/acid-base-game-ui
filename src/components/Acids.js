import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Acids.css';
import { BsTrash, BsPencil } from 'react-icons/bs';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Acids = () => {
    const [acids, setAcids] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAcid, setSelectedAcid] = useState(null);
    const [acidToEdit, setAcidToEdit] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAcid, setNewAcid] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const formatFormula = (compound) => {
        return compound.replace(/(\d+)/g, '<sub>$1</sub>');
    };

    const handleDelete = () => {
        axios.delete(`https://api-generator.retool.com/tnFVDY/acidsbases/${selectedForDelete}`)
            .then(() => {
                setAcids(acids.filter(acid => acid.id !== selectedForDelete));
                setSelectedForDelete(null);
                setShowDeleteModal(false); 
                setDeleteMode(false); 
                toast.success('Acid deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting acid:', error);
                toast.error('Could not delete Acid!');
            });
    };

    const handleSelectForDelete = (acid) => {
        setSelectedForDelete(acid.id);
        setShowDeleteModal(true); 
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
        const updatedAcid = {
            Type: 'Acid',
            Compound: acidToEdit
        };

        axios.put(`https://api-generator.retool.com/tnFVDY/acidsbases/${selectedAcid}`, updatedAcid)
            .then(() => {
                setAcids(acids.map(acid => acid.id === selectedAcid ? { ...acid, Compound: acidToEdit } : acid));
                setShowModal(false);
                setSelectedAcid(null);
                setEditMode(false);
                toast.success('Acid updated successfully!');
            })
            .catch(error => {
                console.error('Error updating acid:', error);
                toast.error('Could not update Acid!');
            });
    };

    const handleAddAcid = () => {
        const acidExists = acids.some(acid => acid.Compound.toLowerCase() === newAcid.toLowerCase());

        if (acidExists) {
            setErrorMessage('Acid already exists!');
            toast.error('Acid already exists!');
            return;
        }

        const newAcidData = {
            Type: 'Acid',
            Compound: newAcid
        };

        axios.post('https://api-generator.retool.com/tnFVDY/acidsbases', newAcidData)
            .then((response) => {
                setAcids([...acids, response.data]);
                setShowAddModal(false);
                setNewAcid('');
                setErrorMessage('');
                toast.success('Acid added successfully!');
                triggerConfetti();
            })
            .catch(error => {
                console.error('Error adding acid:', error);
                toast.error('Could not add Acid!');
            });
    };

    const triggerConfetti = () => {
        const duration = 1 * 1000; 
        const end = Date.now() + duration;
        const vibrantColors = ['#FF6347', '#FF4500', '#FFD700', '#ADFF2F', '#00CED1', '#1E90FF', '#9932CC', '#FF69B4']; 
        const frame = () => {
            confetti({
                particleCount: 7, 
                startVelocity: 30,
                spread: 360, 
                ticks: 200,
                origin: {
                    x: Math.random(), 
                    y: Math.random() * 0.2 
                },
                gravity: 0.7, 
                scalar: 1.2, 
                colors: vibrantColors 
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };    

    const handleCancelDelete = () => {
        setShowDeleteModal(false); 
        setSelectedForDelete(null); 
        setDeleteMode(false);
    };

    const handleCancelEdit = () => {
        setShowModal(false);
        setSelectedAcid(null);
        setEditMode(false); 
    };

    const filteredAcids = acids.filter(acid =>
        acid.Compound.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="acids-container">
            <div className="header-row">
                <h2>ACIDS</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search acids"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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
                {filteredAcids.map((acid, index) => (
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
                            <h3 dangerouslySetInnerHTML={{ __html: formatFormula(acid.Compound) }}></h3>
                        )}
                    </div>
                ))}
                <div className="add-acid" onClick={() => setShowAddModal(true)}>
                    <h3>+</h3>
                </div>
            </div>

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
                        <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm deletion of this acid?</h3>
                        <h3 dangerouslySetInnerHTML={{ __html: formatFormula(acids.find(acid => acid.id === selectedForDelete)?.Compound) }}></h3>
                        <button className="btn btn-primary" onClick={handleDelete}>OK</button>
                        <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={1000} />
        </div>
    );
};

export default Acids;