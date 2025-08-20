import React, { useEffect, useState } from 'react';
import './AdminLeave.css';
import { API_BASE_URL } from '../constants';
import LeaveDetailsModal from './LeaveDetailsModal';
import Searchbar from './Searchbar';
import Footer from './Footer';
import Navbar from './Navbar';

const AdminLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/leave/all`, {
        credentials: 'include',
      });
      const data = await res.json();
      const allLeaves = data.leaves || [];
      setLeaves(allLeaves);
      applyFilters(allLeaves, statusFilter, searchQuery);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };

  const applyFilters = (leaveList, status, query) => {
    let filtered = status === 'All'
      ? leaveList
      : leaveList.filter((l) => l.status === status);

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.name?.toLowerCase().includes(lowerQuery) ||
          l.employee?.name?.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredLeaves(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (status) => {
    setStatusFilter(status);
    applyFilters(leaves, status, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(leaves, statusFilter, query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    applyFilters(leaves, statusFilter, '');
  };

  const handleStatusChange = async () => {
    await fetchLeaves();
  };

  const getImageUrl = (img) => {
    if (img) {
      return img.startsWith('/uploads')
        ? `${API_BASE_URL.replace('/api', '')}${img}`
        : img;
    }
    return 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredLeaves.slice(indexOfFirst, indexOfLast);

  return (
    <div className="admin-leave-page">
      <Navbar onStatusChange={handleFilter} statusFilter={statusFilter} />
      
      <Searchbar
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        onClear={handleClearSearch}
      />

      <div className="admin-leave-table-container">
        <table className="admin-leave-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Leave Type</th>
              <th>Department</th>
              <th>Days</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((leave) => (
                <tr key={leave._id} onClick={() => setSelectedLeave(leave)}>
                  <td>
                    <img
                      src={getImageUrl(leave.image || leave.employee?.image)}
                      alt="emp"
                      className="admin-leave-img"
                    />
                  </td>
                  <td>{leave.empId || leave.employee?.empId}</td>
                  <td>{leave.name || leave.employee?.name}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.department || leave.employee?.department}</td>
                  <td>
                    {Math.ceil(
                      (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
                    ) + 1}
                  </td>
                  <td>{leave.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-leaves">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredLeaves.length > 0 && (
        <Footer
          currentPage={currentPage}
          totalPages={Math.ceil(filteredLeaves.length / itemsPerPage)}
          setCurrentPage={setCurrentPage}
          totalL={filteredLeaves.length}
          currentL={currentItems.length}
          footerClass="admin-table-footer"
        />
      )}

      {selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default AdminLeave;
