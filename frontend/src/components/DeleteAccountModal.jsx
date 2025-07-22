import React, { useState } from 'react';
import './DeleteAccountModal.css';

const DeleteAccountModal = ({ onClose, onConfirm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    onConfirm(email, password);
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3>Delete Account</h3>
        <p className="warning">⚠️ This will permanently delete your account and all employee data.</p>

        <input
          type="email"
          placeholder="Confirm Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-btn" onClick={handleConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
