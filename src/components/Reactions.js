import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reactions.css';
import { BsTrash, BsPencil } from 'react-icons/bs';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reactions = () => {
    const [reactions, setReactions] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [reactionToEdit, setReactionToEdit] = useState({ Reaction: '', Answer: '' });
    const [showModal, setShowModal] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReaction, setNewReaction] = useState({ Reaction: '', Answer: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        axios.get('https://retoolapi.dev/JgRl9e/reactions')
            .then((response) => {
                setReactions(response.data.filter(item => item.Type === "Compound"));
            })
            .catch((error) => {
                console.error('Error fetching reactions:', error);
            });
    }, []);

    const formatReaction = (reaction) => {
        return reaction
            .replace(/([a-zA-Z])(\d+)/g, '$1<sub>$2</sub>') 
            .replace(/\(([^)]+)\)(\d+)/g, '($1)<sub>$2</sub>'); 
    };

    const handleDelete = () => {
        axios.delete(`https://api-generator.retool.com/JgRl9e/reactions/${selectedForDelete}`)
            .then(() => {
                setReactions(reactions.filter(reaction => reaction.id !== selectedForDelete));
                setSelectedForDelete(null);
                setShowDeleteModal(false); 
                setDeleteMode(false); 
                toast.success('Reaction deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting reaction:', error);
                toast.error('Could not delete Reaction!');
            });
    };

    const handleSelectForDelete = (reaction) => {
        setSelectedForDelete(reaction.id);
    };

    const handleEdit = (reaction) => {
        if (selectedReaction === reaction.id) {
            setShowModal(true);
        } else {
            setSelectedReaction(reaction.id);
            setReactionToEdit(reaction);
        }
    };

    const handleUpdateReaction = () => {
        const updatedReaction = {
            Type: 'Compound',
            Reaction: reactionToEdit.Reaction,
            Answer: reactionToEdit.Answer
        };

        axios.put(`https://api-generator.retool.com/JgRl9e/reactions/${selectedReaction}`, updatedReaction)
            .then(() => {
                setReactions(reactions.map(reaction => reaction.id === selectedReaction ? { ...reaction, ...reactionToEdit } : reaction));
                setShowModal(false);
                setSelectedReaction(null);
                setEditMode(false);
                toast.success('Reaction updated successfully!');
            })
            .catch(error => {
                console.error('Error updating reaction:', error);
                toast.error('Could not update Reaction!');
            });
    };

    const handleAddReaction = () => {
        const reactionExists = reactions.some(reaction => reaction.Reaction.toLowerCase() === newReaction.Reaction.toLowerCase());

        if (reactionExists) {
            setErrorMessage('Reaction already exists!');
            toast.error('Reaction already exists!');
            return;
        }

        const newReactionData = {
            Type: 'Compound',
            Reaction: newReaction.Reaction,
            Answer: newReaction.Answer
        };

        axios.post('https://api-generator.retool.com/JgRl9e/reactions', newReactionData)
            .then((response) => {
                setReactions([...reactions, response.data]);
                setShowAddModal(false);
                setNewReaction({ Reaction: '', Answer: '' });
                setErrorMessage('');
                toast.success('Reaction added successfully!');
                triggerConfetti();
            })
            .catch(error => {
                console.error('Error adding reaction:', error);
                toast.error('Could not add Reaction!');
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
        setSelectedReaction(null);
        setEditMode(false); 
    };

    const filteredReactions = reactions.filter(reaction =>
        reaction.Reaction.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="reactions-container-new">
            <div className="header-row-new">
                <h2 className="reactions-title-new">REACTIONS</h2>
                <div className="search-bar-new">
                    <input
                        type="text"
                        placeholder="Search reactions"
                        className="search-bar-input-new"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="action-buttons-new">
                    <button
                        className={`btn-new btn-danger-new ${deleteMode ? 'active' : ''}`}
                        onClick={() => {
                            setDeleteMode(!deleteMode);
                            setEditMode(false);
                            setSelectedForDelete(null);
                            setSelectedReaction(null);
                        }}
                    >
                        {deleteMode ? 'Cancel' : 'Delete Reaction'}
                    </button>
                    <button
                        className={`btn-new btn-warning-new ${editMode ? 'active' : ''}`}
                        onClick={() => {
                            setEditMode(!editMode);
                            setDeleteMode(false);
                            setSelectedReaction(null);
                            setSelectedForDelete(null);
                        }}
                    >
                        {editMode ? 'Cancel' : 'Edit Reaction'}
                    </button>
                </div>
            </div>

            <div className="reactions-grid-new">
                {filteredReactions.map((reaction, index) => (
                    <div
                        key={index}
                        className={`reaction-card-new
              ${deleteMode && 'highlight-for-delete-new'}
              ${editMode && 'highlight-for-edit-new'}
              ${selectedForDelete === reaction.id && deleteMode ? 'selected-for-delete-new' : ''}
              ${selectedReaction === reaction.id && editMode ? 'selected-for-edit-new' : ''}`}
                        onClick={() => {
                            if (deleteMode) {
                                if (selectedForDelete === reaction.id) {
                                    setShowDeleteModal(true); 
                                } else {
                                    handleSelectForDelete(reaction); 
                                }
                            }
                            if (editMode) handleEdit(reaction);
                        }}
                    >
                        {selectedForDelete === reaction.id && deleteMode ? (
                            <BsTrash className="trash-icon-new" />
                        ) : selectedReaction === reaction.id && editMode ? (
                            <BsPencil className="pencil-icon-new" />
                        ) : (
                            <div>
                                <h3 dangerouslySetInnerHTML={{ __html: formatReaction(reaction.Reaction) }}></h3>
                                <p dangerouslySetInnerHTML={{ __html: formatReaction(reaction.Answer) }}></p>
                            </div>
                        )}
                    </div>
                ))}
                <div className="add-reaction-new" onClick={() => setShowAddModal(true)}>
                    <h3>+</h3>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Reaction</h3>
                        <input
                            type="text"
                            value={reactionToEdit.Reaction}
                            onChange={(e) => setReactionToEdit({ ...reactionToEdit, Reaction: e.target.value })}
                        />
                        <input
                            type="text"
                            className="modal-input-new"
                            value={reactionToEdit.Answer}
                            onChange={(e) => setReactionToEdit({ ...reactionToEdit, Answer: e.target.value })}
                        />
                        <button className="btn btn-primary" onClick={handleUpdateReaction}>Update</button>
                        <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Reaction</h3>
                        <input
                            type="text"
                            value={newReaction.Reaction}
                            onChange={(e) => setNewReaction({ ...newReaction, Reaction: e.target.value })}
                            placeholder="Enter reaction"
                        />
                        <input
                            type="text"
                            className="modal-input-new"
                            value={newReaction.Answer}
                            onChange={(e) => setNewReaction({ ...newReaction, Answer: e.target.value })}
                            placeholder="Enter answer"
                        />
                        {errorMessage && <p className="error-message-new">{errorMessage}</p>}
                        <button className="btn btn-primary" onClick={handleAddReaction}>Add</button>
                        <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm deletion of this reaction?</h3>
                        <h3 dangerouslySetInnerHTML={{ __html: formatReaction(reactions.find(reaction => reaction.id === selectedForDelete)?.Reaction) }}></h3>
                        <button className="btn btn-primary" onClick={handleDelete}>OK</button>
                        <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={1000} />
        </div>
    );
};

export default Reactions;