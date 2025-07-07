import React, { useState, useEffect } from 'react';
import './AddEmployeeForm.css';

const AddEmployeeForm = ({ onSave, onCancel, editData, onValidationError }) => {
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    address: '',
    phone: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id || null,
        image: editData.image || '',
        name: editData.name || '',
        email: editData.email || '',
        address: editData.address || '',
        phone: editData.phone || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { image, name, email, address, phone } = form;
    const newErrors = {};

    if (!image) newErrors.image = "Image URL is required";
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!address) newErrors.address = "Address is required";
    if (!phone) newErrors.phone = "Phone is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) newErrors.email = "Invalid email format";

    const phonePattern = /^[0-9]{10}$/;
    if (phone && !phonePattern.test(phone)) newErrors.phone = "Invalid 10-digit phone number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGlobalError("Please fix the highlighted fields");
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    setGlobalError("");
    onSave(form);
    setIsSubmitting(false);
  };

  return (
    <div className="add-form-container">
      <form onSubmit={handleSubmit} className="add-form">

        {globalError && <div className="global-error">{globalError}</div>}

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className={errors.image ? "input-error" : ""}
        />
        {errors.image && <span className="error">{errors.image}</span>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className={errors.address ? "input-error" : ""}
        />
        {errors.address && <span className="error">{errors.address}</span>}

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className={errors.phone ? "input-error" : ""}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}

        {form.image && (
          <img src={form.image} alt="Avatar Preview" />
        )}

        <div className="button-row">
          <button type="submit" className="save-btn">
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
