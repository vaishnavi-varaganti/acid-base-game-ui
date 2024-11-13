import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Neither.css';
import { BsTrash, BsPencil } from 'react-icons/bs';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Neither = () => {
    const [neithers, setNeithers] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedNeither, setSelectedNeither] = useState(null);
    const [neitherToEdit, setNeitherToEdit] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newNeither, setNewNeither] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        axios.get('https://retoolapi.dev/tnFVDY/acidsbases')
            .then((response) => {
                const neitherData = response.data.filter(item => item.Type === "Neither");
                setNeithers(neitherData);
            })
            .catch((error) => {
                console.error('Error fetching neither items:', error);
            });
    }, []);

    const formatFormula = (compound) => {
        return compound.replace(/(\d+)/g, '<sub>$1</sub>');
    };

    const handleDelete = () => {
        axios.delete(`https://api-generator.retool.com/tnFVDY/acidsbases/${selectedForDelete}`)
            .then(() => {
                setNeithers(neithers.filter(neither => neither.id !== selectedForDelete));
                setSelectedForDelete(null);
                setShowDeleteModal(false); 
                setDeleteMode(false); 
                toast.success('Item deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting item:', error);
                toast.error('Could not delete item!');
            });
    };

    const handleSelectForDelete = (neither) => {
        setSelectedForDelete(neither.id);
        setShowDeleteModal(true); 
    };

    const handleEdit = (neither) => {
        if (selectedNeither === neither.id) {
            setShowModal(true);
        } else {
            setSelectedNeither(neither.id);
            setNeitherToEdit(neither.Compound);
        }
    };

    const handleUpdateNeither = () => {
        const updatedNeither = {
            Type: 'Neither',
            Compound: neitherToEdit
        };

        axios.put(`https://api-generator.retool.com/tnFVDY/acidsbases/${selectedNeither}`, updatedNeither)
            .then(() => {
                setNeithers(neithers.map(neither => neither.id === selectedNeither ? { ...neither, Compound: neitherToEdit } : neither));
                setShowModal(false);
                setSelectedNeither(null);
                setEditMode(false);
                toast.success('Item updated successfully!');
            })
            .catch(error => {
                console.error('Error updating item:', error);
                toast.error('Could not update item!');
            });
    };

    const handleAddNeither = () => {
        const neitherExists = neithers.some(neither => neither.Compound.toLowerCase() === newNeither.toLowerCase());

        if (neitherExists) {
            setErrorMessage('Item already exists!');
            toast.error('Item already exists!');
            return;
        }

        const newNeitherData = {
            Type: 'Neither',
            Compound: newNeither
        };

        axios.post('https://api-generator.retool.com/tnFVDY/acidsbases', newNeitherData)
            .then((response) => {
                setNeithers([...neithers, response.data]);
                setShowAddModal(false);
                setNewNeither('');
                setErrorMessage('');
                toast.success('Item added successfully!');
                triggerConfetti();
            })
            .catch(error => {
                console.error('Error adding item:', error);
                toast.error('Could not add item!');
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
        setSelectedNeither(null);
        setEditMode(false); 
    };

    const filteredNeithers = neithers.filter(neither =>
        neither.Compound.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="neither-container">
            <div className="header-row">
                <h2>NEITHER</h2>
                <div className="search-bar-neither">
                    <input
                        type="text"
                        placeholder="Search items"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="action-buttons-neither">
                    <button
                        className={`btn btn-danger ${deleteMode ? 'active' : ''}`}
                        onClick={() => {
                            setDeleteMode(!deleteMode);
                            setEditMode(false);
                            setSelectedForDelete(null);
                            setSelectedNeither(null);
                        }}
                    >
                        {deleteMode ? 'Cancel' : 'Delete Item'}
                    </button>
                    <button
                        className={`btn btn-warning ${editMode ? 'active' : ''}`}
                        onClick={() => {
                            setEditMode(!editMode);
                            setDeleteMode(false);
                            setSelectedNeither(null);
                            setSelectedForDelete(null);
                        }}
                    >
                        {editMode ? 'Cancel' : 'Edit Item'}
                    </button>
                </div>
            </div>

            <div className="neither-grid">
                {filteredNeithers.map((neither, index) => (
                    <div
                        key={index}
                        className={`neither-card
              ${deleteMode && 'highlight-for-delete'}
              ${editMode && 'highlight-for-edit'}
              ${selectedForDelete === neither.id && deleteMode ? 'selected-for-delete' : ''}
              ${selectedNeither === neither.id && editMode ? 'selected-for-edit' : ''}`}
                        onClick={() => {
                            if (deleteMode) handleSelectForDelete(neither);
                            if (editMode) handleEdit(neither);
                        }}
                    >
                        {selectedForDelete === neither.id && deleteMode ? (
                            <BsTrash className="trash-icon" />
                        ) : selectedNeither === neither.id && editMode ? (
                            <BsPencil className="pencil-icon" />
                        ) : (
                            <h3 dangerouslySetInnerHTML={{ __html: formatFormula(neither.Compound) }}></h3>
                        )}
                    </div>
                ))}
                <div className="add-neither" onClick={() => setShowAddModal(true)}>
                    <h3>+</h3>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Item</h3>
                        <input
                            type="text"
                            value={neitherToEdit}
                            onChange={(e) => setNeitherToEdit(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleUpdateNeither}>Update</button>
                        <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Item</h3>
                        <input
                            type="text"
                            value={newNeither}
                            onChange={(e) => setNewNeither(e.target.value)}
                            placeholder="Enter item name"
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button className="btn btn-primary" onClick={handleAddNeither}>Add</button>
                        <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm deletion of this item?</h3>
                        <h3 dangerouslySetInnerHTML={{ __html: formatFormula(neithers.find(neither => neither.id === selectedForDelete)?.Compound) }}></h3>
                        <button className="btn btn-primary" onClick={handleDelete}>OK</button>
                        <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={1000} />
        </div>
    );
};

export default Neither;