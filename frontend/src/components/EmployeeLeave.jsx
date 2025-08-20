import React, { useState, useEffect } from 'react';
import EmployeeNavbar from './EmployeeNavbar';
import LeaveFormModal from './LeaveFormModal';
import Footer from './Footer';
import EmployeeLeaveDetailsModal from './EmployeeLeaveDetailsModal';
import './EmployeeLeave.css';
import { API_BASE_URL } from '../constants';

const EmployeeLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [leavesPerPage] = useState(5);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/leave/my`, {
        credentials: 'include',
      });
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAddLeaveClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleSuccess = () => {
    setShowModal(false);
    fetchLeaves();
  };

  const handleRowClick = (leave) => {
    setSelectedLeave(leave);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedLeave(null);
    setShowDetailsModal(false);
  };

  // Pagination logic
  const totalLeaves = leaves.length;
  const totalPages = Math.ceil(totalLeaves / leavesPerPage);
  const indexOfLastLeave = currentPage * leavesPerPage;
  const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
  const currentLeaves = leaves.slice(indexOfFirstLeave, indexOfLastLeave);

  const formatDate = (dateValue) => {
    return dateValue && !isNaN(new Date(dateValue))
      ? new Date(dateValue).toLocaleDateString()
      : '—';
  };

  return (
    <>
      <EmployeeNavbar onAddLeave={handleAddLeaveClick} />
      <div className="leave-page">
        <div className="leave-header">
          <h2>My Leave Requests</h2>
        </div>
        <table className="leave-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Applied On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaves.map((leave, index) => (
              <tr 
                key={leave._id} 
                onClick={() => handleRowClick(leave)} 
                style={{ cursor: 'pointer' }}
              >
                <td>{indexOfFirstLeave + index + 1}</td>
                <td>{leave.leaveType}</td>
                <td>{formatDate(leave.fromDate)}</td>
                <td>{formatDate(leave.toDate)}</td>
                <td>{formatDate(leave.appliedAt)}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Footer
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalL={totalLeaves}
          currentL={currentLeaves.length}
          footerClass="employee-table-footer"
        />
      </div>

      {showModal && (
        <LeaveFormModal onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}

      {showDetailsModal && selectedLeave && (
        <EmployeeLeaveDetailsModal leave={selectedLeave} onClose={handleCloseDetails} />
      )}
    </>
  );
};

export default EmployeeLeave;
