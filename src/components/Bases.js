import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bases.css';
import { BsTrash, BsPencil } from 'react-icons/bs';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bases = () => {
    const [bases, setBases] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedBase, setSelectedBase] = useState(null);
    const [baseToEdit, setBaseToEdit] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBase, setNewBase] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        axios.get('https://retoolapi.dev/tnFVDY/acidsbases')
            .then((response) => {
                const basesData = response.data.filter(item => item.Type === "Base");
                setBases(basesData);
            })
            .catch((error) => {
                console.error('Error fetching bases:', error);
            });
    }, []);

    const handleDelete = () => {
        axios.delete(`https://api-generator.retool.com/tnFVDY/acidsbases/${selectedForDelete}`)
            .then(() => {
                setBases(bases.filter(base => base.id !== selectedForDelete));
                setSelectedForDelete(null);
                setShowDeleteModal(false); 
                setDeleteMode(false);
                toast.success('Base deleted successfully.'); 
            })
            .catch(error => {
                console.error('Error deleting base:', error);
                toast.error('Could not delete Base!');
            });
    };

    const handleSelectForDelete = (base) => {
        setSelectedForDelete(base.id);
        setShowDeleteModal(true); 
    };

    const handleEdit = (base) => {
        if (selectedBase === base.id) {
            setShowModal(true);
        } else {
            setSelectedBase(base.id);
            setBaseToEdit(base.Compound);
        }
    };

    const handleUpdateBase = () => {
        const updatedBase = {
            Type: 'Base',
            Compound: baseToEdit
        };

        axios.put(`https://api-generator.retool.com/tnFVDY/acidsbases/${selectedBase}`, updatedBase)
            .then(() => {
                setBases(bases.map(base => base.id === selectedBase ? { ...base, Compound: baseToEdit } : base));
                setShowModal(false);
                setSelectedBase(null);
                setEditMode(false);
                toast.success('Base updated successfully.');
            })
            .catch(error => {
                console.error('Error updating base:', error);
                toast.error('Could not update Base!');
            });
    };

    const handleAddBase = () => {
        const baseExists = bases.some(base => base.Compound.toLowerCase() === newBase.toLowerCase());

        if (baseExists) {
            setErrorMessage('Base already exists!');
            toast.error('Base already exists!');
            return;
        }

        const newBaseData = {
            Type: 'Base',
            Compound: newBase
        };

        axios.post('https://api-generator.retool.com/tnFVDY/acidsbases', newBaseData)
            .then((response) => {
                setBases([...bases, response.data]);
                setShowAddModal(false);
                setNewBase('');
                setErrorMessage('');
                triggerConfetti();
                toast.success('Base added successfully.');
            })
            .catch(error => {
                console.error('Error adding base:', error);
                toast.error('Could not add Base!');
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
        setSelectedBase(null);
        setEditMode(false); 
    };


    const filteredBases = bases.filter(base =>
        base.Compound.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bases-container">
            <div className="header-row">
                <h2>BASES</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search bases"
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
                            setSelectedBase(null);
                        }}
                    >
                        {deleteMode ? 'Cancel' : 'Delete Base'}
                    </button>
                    <button
                        className={`btn btn-warning ${editMode ? 'active' : ''}`}
                        onClick={() => {
                            setEditMode(!editMode);
                            setDeleteMode(false);
                            setSelectedBase(null);
                            setSelectedForDelete(null);
                        }}
                    >
                        {editMode ? 'Cancel' : 'Edit Base'}
                    </button>
                </div>
            </div>

            <div className="bases-grid">
                {filteredBases.map((base, index) => (
                    <div
                        key={index}
                        className={`base-card
              ${deleteMode && 'highlight-for-delete'}
              ${editMode && 'highlight-for-edit'}
              ${selectedForDelete === base.id && deleteMode ? 'selected-for-delete' : ''}
              ${selectedBase === base.id && editMode ? 'selected-for-edit' : ''}`}
                        onClick={() => {
                            if (deleteMode) handleSelectForDelete(base);
                            if (editMode) handleEdit(base);
                        }}
                    >
                        {selectedForDelete === base.id && deleteMode ? (
                            <BsTrash className="trash-icon" />
                        ) : selectedBase === base.id && editMode ? (
                            <BsPencil className="pencil-icon" />
                        ) : (
                            <h3>{base.Compound}</h3>
                        )}
                    </div>
                ))}
                <div className="add-base" onClick={() => setShowAddModal(true)}>
                    <h3>+</h3>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Base</h3>
                        <input
                            type="text"
                            value={baseToEdit}
                            onChange={(e) => setBaseToEdit(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleUpdateBase}>Update</button>
                        <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Base</h3>
                        <input
                            type="text"
                            value={newBase}
                            onChange={(e) => setNewBase(e.target.value)}
                            placeholder="Enter base name"
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button className="btn btn-primary" onClick={handleAddBase}>Add</button>
                        <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm deletion of this base?</h3>
                        <h3>{bases.find(base => base.id === selectedForDelete)?.Compound}</h3>
                        <button className="btn btn-primary" onClick={handleDelete}>OK</button>
                        <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={1000} />
        </div>
    );
};

export default Bases;