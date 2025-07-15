import React from 'react';
import './EmployeeDetailsModal.css';
import { API_BASE_URL } from '../constants';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const {
    name,
    empId,
    email,
    phone,
    address,
    department,
    position,
    gender,
    skills,
    dob,
    image,
  } = employee;

  const getImageUrl = (img) => {
    if (img) {
      return img.startsWith('/uploads')
        ? `${API_BASE_URL.replace('/api', '')}${img}`
        : img;
    }
    return 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';
  };

  return (
    <div className="modal-overlay">
      <div className="employee-details-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="image-container">
          <img src={getImageUrl(image)} alt="Employee" />
        </div>

        <div className="employee-name">{name}</div>

        <div className="details-grid">
          <div><strong>Employee ID:</strong> {empId}</div>
          <div><strong>Email:</strong> {email}</div>
          <div><strong>Phone:</strong> {phone}</div>
          <div><strong>Address:</strong> {address}</div>
          <div><strong>Department:</strong> {department}</div>
          <div><strong>Position:</strong> {position}</div>
          <div><strong>Gender:</strong> {gender}</div>
          <div><strong>Skills:</strong> {skills}</div>
          <div><strong>Date of Birth:</strong> {dob}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
