import React, { useState } from 'react';
import './LeaveFormModal.css';
import { API_BASE_URL } from '../constants';

const LeaveFormModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { leaveType, fromDate, toDate, description } = form;

    if (!leaveType || !fromDate || !toDate || !description) {
      alert('Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/leave/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leaveType, fromDate, toDate, description }),
      });

      const data = await res.json();

      if (res.ok) {
        if (onSuccess) onSuccess(data.leave);
        onClose();
      } else {
        alert(data.message || 'Failed to submit leave request.');
      }
    } catch (err) {
      console.error('Error submitting leave:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="leaveform-box">
        <h3>Request for Leave</h3>

        <label>Leave Type</label>
        <select name="leaveType" value={form.leaveType} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Sick">Sick</option>
          <option value="Casual">Casual</option>
          <option value="Annual">Annual</option>
        </select>

        <label>From Date</label>
        <input
          type="date"
          name="fromDate"
          value={form.fromDate}
          onChange={handleChange}
        />

        <label>To Date</label>
        <input
          type="date"
          name="toDate"
          value={form.toDate}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
        />

        <div className="form-actions">
          <button className="Add" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Add Leave'}
          </button>
          <button className="Close" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveFormModal;
