import React, { useEffect, useState } from 'react';
import './AddEmployeeForm.css';

const AddEmployeeForm = ({ onCancel, onSave, editingData }) => {
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    empId: '',
    department: '',
    position: '',
    gender: '',
    skills: '',
    dob: ''
  });

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    }
  }, [editingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-overlay">
      <div className="form-box">
        <h2>{editingData ? 'Edit Employee' : 'Add New Employee'}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="image-preview">
            <img
              src={formData.image || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
              alt="Preview"
            />
          </div>
          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="empId" placeholder="Employee ID" value={formData.empId} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
          <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
