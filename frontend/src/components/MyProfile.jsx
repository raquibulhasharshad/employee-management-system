import React, { useEffect, useState } from 'react';
import './MyProfile.css';
import { API_BASE_URL } from '../constants';

const MyProfile = () => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employee/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        setEmployee(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handles Cloudinary / external URLs robustly
  const getImageUrl = (img) => {
    if (!img) {
      return 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';
    }
    if (img.startsWith('http')) return img; // external URL / Cloudinary
    if (img.startsWith('/uploads')) return `${API_BASE_URL.replace('/api', '')}${img}`;
    return img; // fallback
  };

  if (!employee) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-heading">My Profile</h2>
        <img
          className="profile-image"
          src={getImageUrl(employee.image)}
          alt={employee.name || 'Employee'}
        />
        <div className="profile-details">
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Employee ID:</strong> {employee.empId}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phone}</p>
          <p><strong>Address:</strong> {employee.address}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          <p><strong>Gender:</strong> {employee.gender}</p>
          <p><strong>Skills:</strong> {employee.skills}</p>
          <p><strong>Date of Birth:</strong> {employee.dob}</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
