import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({
  data,
  selectedRows,
  setSelectedRows,
  onEdit,
  onDeleteSingle,
  onMailSingle,
  onRowClick
}) => {
  const handleSelectRow = (id) => {
    const updated = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(updated);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(emp => emp.id));
    }
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
              style={{ cursor: 'pointer' }}
            >
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(emp.id)}
                  onChange={() => handleSelectRow(emp.id)}
                />
              </td>
              <td>
                <img
                  src={emp.image || '/default-avatar.png'}
                  alt="emp"
                  className="employee-image"
                />
              </td>
              <td>
                <span className="name-text">{emp.name}</span>
              </td>
              <td>{emp.empId}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button className="action-btn mail" onClick={() => onMailSingle(index)}>📧</button>
                <button className="action-btn edit" onClick={() => onEdit(index)}>✏️</button>
                <button className="action-btn delete" onClick={() => onDeleteSingle(index)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
