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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    }
  }, [editingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error when user types
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.empId.trim()) newErrors.empId = 'Employee ID is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
    if (!formData.dob.trim()) newErrors.dob = 'Date of Birth is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
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
          <div>
            <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
          </div>

          <div>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div>
            <input type="text" name="empId" placeholder="Employee ID" value={formData.empId} onChange={handleChange} />
            {errors.empId && <div className="error">{errors.empId}</div>}
          </div>

          <div>
            <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div>
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <div className="error">{errors.phone}</div>}
          </div>

          <div>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            {errors.address && <div className="error">{errors.address}</div>}
          </div>

          <div>
            <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
            {errors.department && <div className="error">{errors.department}</div>}
          </div>

          <div>
            <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} />
            {errors.position && <div className="error">{errors.position}</div>}
          </div>

          <div>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <div className="error">{errors.gender}</div>}
          </div>

          <div>
            <input type="text" name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} />
          </div>

          <div>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            {errors.dob && <div className="error">{errors.dob}</div>}
          </div>

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
