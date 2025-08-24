import React, { useState, useEffect } from 'react';
import './SalaryFormModal.css';
import { API_BASE_URL } from '../constants';

const SalaryDetailsModal = ({ salary, onClose, onStatusChange }) => {
  const [form, setForm] = useState({
    basicSalary: salary.basicSalary,
    bonus: salary.bonus,
    deductions: salary.deductions,
    status: salary.status,
    month: salary.month,
  });

  const [employee, setEmployee] = useState(salary.employee || null);

  const defaultAvatar =
    'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';

  const wasPaid = salary.status === 'Paid';
  const isPaid = form.status === 'Paid';

  // Fetch full employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const empId = salary.employee?._id || salary.employeeId;
        if (!empId) return;

        const res = await fetch(`${API_BASE_URL}/employees/${empId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data) setEmployee(data);
      } catch (err) {
        console.error('Failed to fetch employee details:', err);
      }
    };
    fetchEmployee();
  }, [salary]);

  const netSalary =
    Number(form.basicSalary || 0) +
    Number(form.bonus || 0) -
    Number(form.deductions || 0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent updates if salary was already Paid and still Paid
    if (wasPaid && isPaid) {
      alert('Salary already marked as Paid. No further updates allowed.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/salary/${salary._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicSalary: Number(form.basicSalary) || 0,
          bonus: Number(form.bonus) || 0,
          deductions: Number(form.deductions) || 0,
          netSalary,
          status: form.status,
          month: form.month,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onStatusChange(salary._id, form.status);

        // Close only if salary is now Paid
        if (isPaid) {
          onClose();
        } else {
          alert('Salary updated successfully. You can continue editing.');
        }
      } else {
        alert(data.message || 'Failed to update salary');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating salary');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/salary/${salary._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        alert('Salary deleted successfully');
        onClose();
        onStatusChange(salary._id, null); // remove from list
      } else {
        alert(data.message || 'Failed to delete salary');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting salary');
    }
  };

  const getImageUrl = (img) =>
    !img
      ? defaultAvatar
      : img.startsWith('/uploads')
      ? `${API_BASE_URL.replace('/api', '')}${img}`
      : img;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{isPaid ? 'View Salary (Paid)' : 'Edit Salary'}</h3>
        <form onSubmit={handleSubmit}>
          {/* Employee Preview */}
          {employee && (
            <div className="employee-preview">
              <img
                src={getImageUrl(employee.image)}
                alt="Employee"
                className="employee-img"
              />
              <div className="employee-info">
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Emp ID:</strong> {employee.empId}</p>
                <p><strong>Email:</strong> {employee.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {employee.phone || 'N/A'}</p>
                <p><strong>Department:</strong> {employee.department || 'N/A'}</p>
              </div>
            </div>
          )}

          <label>Basic Salary:</label>
          <input
            type="number"
            name="basicSalary"
            value={form.basicSalary}
            onChange={handleChange}
            disabled={isPaid && wasPaid}
            required
          />

          <label>Bonus:</label>
          <input
            type="number"
            name="bonus"
            value={form.bonus}
            onChange={handleChange}
            disabled={isPaid && wasPaid}
          />

          <label>Deductions:</label>
          <input
            type="number"
            name="deductions"
            value={form.deductions}
            onChange={handleChange}
            disabled={isPaid && wasPaid}
          />

          <label>Month:</label>
          <input type="text" name="month" value={form.month} readOnly />

          <label>Net Salary:</label>
          <input type="number" value={netSalary} readOnly />

          <label>Status:</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isPaid && wasPaid}
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>

          <div className="modal-actions">
            {!isPaid || !wasPaid ? (
              <>
                <button type="submit">Update</button>
                <button type="button" className="delete-salary" onClick={handleDelete}>
                  Delete
                </button>
              </>
            ) : null}
            <button type="button" onClick={onClose}>
              {isPaid && wasPaid ? 'Close' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryDetailsModal;
