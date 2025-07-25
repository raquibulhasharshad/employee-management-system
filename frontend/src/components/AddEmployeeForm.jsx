import React, { useEffect, useState } from 'react';
import './AddEmployeeForm.css';
import { API_BASE_URL } from '../constants';

const AddEmployeeForm = ({ onSave, onCancel, editingData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    empId: '',
    department: '',
    position: '',
    skills: '',
    gender: '',
    dob: '',
    image: null,
    removeImage: false,
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [existingEmployees, setExistingEmployees] = useState([]);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setExistingEmployees(data);
      } catch (err) {
        console.error('Failed to fetch existing employees:', err);
      }
    };
    fetchExisting();
  }, []);

  useEffect(() => {
    if (editingData) {
      const { image, ...rest } = editingData;
      setFormData(prev => ({ ...prev, ...rest, image: null, removeImage: false }));

      if (image) {
        const imageUrl = image.startsWith('/uploads')
          ? `${API_BASE_URL.replace('/api', '')}${image}`
          : image;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl('');
      }
    } else {
      setPreviewUrl('');
    }
  }, [editingData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file, removeImage: false }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image: null, removeImage: true }));
    setPreviewUrl('');
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.empId) newErrors.empId = 'Employee ID is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';

    // Custom validation
    const emailConflict = existingEmployees.find(emp =>
      emp.email === formData.email &&
      emp.id !== editingData?.id
    );

    if (emailConflict) {
      newErrors.email = (emailConflict.admin === editingData?.admin)
        ? 'Employee email ID already exists for this admin'
        : 'Email ID already exists for some other company';
    }

    const empIdConflict = existingEmployees.find(emp =>
      emp.empId === formData.empId &&
      emp.admin === editingData?.admin &&
      emp.id !== editingData?.id
    );

    if (empIdConflict) {
      newErrors.empId = 'Employee ID already exists for this admin';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && key !== 'removeImage') {
        formDataToSend.append(key, formData[key]);
      }
    }
    if (formData.removeImage) {
      formDataToSend.append('removeImage', 'true');
    }
    if (editingData) {
      formDataToSend.append('id', editingData.id);
    }

    onSave(formDataToSend, !!editingData);
  };

  return (
    <div className="form-box">
      <h2>{editingData ? 'Edit Employee' : 'Add New Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="image-preview">
            <div className="image-wrapper">
              <img
                src={
                  previewUrl ||
                  'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'
                }
                alt="Preview"
              />
              {previewUrl && (
                <span className="image-remove" onClick={handleImageRemove}>
                  ❌
                </span>
              )}
            </div>
          </div>

          <div className="image-upload-below">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="text"
              name="empId"
              placeholder="Employee ID"
              value={formData.empId}
              onChange={handleInputChange}
            />
            {errors.empId && <p className="error">{errors.empId}</p>}
          </div>

          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          <div>
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleInputChange}
            />
            {errors.department && <p className="error">{errors.department}</p>}
          </div>

          <div>
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleInputChange}
            />
            {errors.position && <p className="error">{errors.position}</p>}
          </div>

          <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={formData.skills}
            onChange={handleInputChange}
          />

          <div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="error">{errors.gender}</p>}
          </div>

          <div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            {errors.dob && <p className="error">{errors.dob}</p>}
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" className="cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
