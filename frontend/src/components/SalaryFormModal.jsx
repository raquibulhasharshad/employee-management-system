import React, { useState, useEffect } from 'react';
import './SalaryFormModal.css';
import { API_BASE_URL } from '../constants';

const SalaryFormModal = ({ onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: '',
    basicSalary: '',
    bonus: '',
    deductions: '',
    month: '',
    status: 'Unpaid',
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const defaultAvatar =
    'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`, {
          credentials: 'include',
        });
        const data = await res.json();
        setEmployees(data || []);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Update selected employee when employeeId changes
  useEffect(() => {
    const emp = employees.find(
      (e) => e._id === form.employeeId || e.id === form.employeeId
    );
    setSelectedEmployee(emp || null);
  }, [form.employeeId, employees]);

  const netSalary =
    Number(form.basicSalary || 0) +
    Number(form.bonus || 0) -
    Number(form.deductions || 0);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formattedMonth = '';
    if (form.month) {
      const [year, month] = form.month.split('-');
      formattedMonth = `${month}-${year}`;
    }

    try {
      const payload = {
        ...form,
        basicSalary: Number(form.basicSalary),
        bonus: Number(form.bonus),
        deductions: Number(form.deductions),
        netSalary,
        month: formattedMonth,
      };

      const res = await fetch(`${API_BASE_URL}/salary/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert(data.message || 'Failed to add salary');
      }
    } catch (err) {
      console.error('Error adding salary:', err);
      alert('Something went wrong');
    }
  };

  const getImageUrl = (img) => {
    if (!img) return defaultAvatar;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads')) return `${API_BASE_URL.replace('/api', '')}${img}`;
    return img;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add Salary</h3>
        <form onSubmit={handleSubmit}>
          <label>Employee:</label>
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id || emp.id} value={emp._id || emp.id}>
                {emp.name} ({emp.empId})
              </option>
            ))}
          </select>

          {selectedEmployee && (
            <div className="employee-preview">
              <img
                src={getImageUrl(selectedEmployee.image)}
                alt={selectedEmployee.name || 'Employee'}
                className="employee-img"
              />
              <div className="employee-info">
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Emp ID:</strong> {selectedEmployee.empId}</p>
                <p><strong>Email:</strong> {selectedEmployee.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedEmployee.phone || 'N/A'}</p>
                <p><strong>Department:</strong> {selectedEmployee.department || 'N/A'}</p>
              </div>
            </div>
          )}

          <label>Basic Salary:</label>
          <input
            type="number"
            name="basicSalary"
            value={form.basicSalary}
            onChange={handleChange}
            required
          />

          <label>Bonus:</label>
          <input
            type="number"
            name="bonus"
            value={form.bonus}
            onChange={handleChange}
          />

          <label>Deductions:</label>
          <input
            type="number"
            name="deductions"
            value={form.deductions}
            onChange={handleChange}
          />

          <label>Month:</label>
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={handleChange}
            required
          />

          <label>Net Salary:</label>
          <input type="number" value={netSalary} readOnly />

          <label>Status:</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>

          <div className="modal-actions">
            <button type="submit">Add Salary</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryFormModal;
