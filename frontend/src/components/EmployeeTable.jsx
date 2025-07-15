import React from 'react';
import './EmployeeTable.css';
import { API_BASE_URL } from '../constants';

const EmployeeTable = ({
  data,
  selectedRows,
  setSelectedRows,
  onEdit,
  onDeleteSingle,
  onMailSingle,
  onRowClick,
}) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((emp) => emp.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getImageUrl = (img) => {
    if (img) {
      return img.startsWith('/uploads')
        ? `${API_BASE_URL.replace('/api', '')}${img}`
        : img;
    }
    return 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';
  };

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Image</th>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp, index) => (
            <tr
              key={emp.id}
              onClick={() => onRowClick(index)}
              className="clickable-row"
            >
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(emp.id)}
                  onChange={() => handleSelectOne(emp.id)}
                />
              </td>
              <td>
                <img
                  src={getImageUrl(emp.image)}
                  alt="Employee"
                  className="employee-image"
                />
              </td>
              <td>{emp.name}</td>
              <td>{emp.empId}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button className="action-btn edit" onClick={() => onEdit(index)}>✏️</button>
                <button className="action-btn delete" onClick={() => onDeleteSingle(index)}>🗑️</button>
                <button className="action-btn mail" onClick={() => onMailSingle(index)}>📧</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
