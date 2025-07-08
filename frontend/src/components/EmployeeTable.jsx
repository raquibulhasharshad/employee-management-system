import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({
  data,
  selectedRows,
  setSelectedRows,
  onEdit,
  onDeleteSingle,
  onMailSingle,
  onNameClick,
}) => {
  const toggleSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map(emp => emp.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = data.length > 0 && data.every(emp => selectedRows.includes(emp.id));

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
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
            <tr key={emp.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(emp.id)}
                  onChange={() => toggleSelect(emp.id)}
                />
              </td>
              <td>
                <img
                  src={emp.image || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg' + emp.id}
                  alt={emp.name}
                  className="employee-image"
                />
              </td>
              <td>{emp.name}</td>
              <td>{emp.empId || 'N/A'}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>
                <button className="action-btn mail" onClick={() => onMailSingle(index)}>📧</button>
                <button className="action-btn edit" onClick={() => onEdit(index)}>✏️</button>
                <button className="action-btn delete" onClick={() => onDeleteSingle(index)}>🗑️</button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
