/* eslint-disable react/prop-types */
import "./DeleteModal.css"; // Import CSS if needed

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="quiz-overlay">
      <div className="quiz-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this quiz?</p>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteModal;
