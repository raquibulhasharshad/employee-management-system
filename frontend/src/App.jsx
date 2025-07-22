import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import EmployeeTable from './components/EmployeeTable';
import Footer from './components/Footer';
import AddEmployeeForm from './components/AddEmployeeForm';
import ConfirmDialog from './components/ConfirmDialog';
import Mail from './components/Mail';
import Searchbar from './components/Searchbar';
import EmployeeDetailsModal from './components/EmployeeDetailsModal';
import './App.css';
import { API_BASE_URL } from './constants';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailRecipients, setMailRecipients] = useState([]);

  const recordsPerPage = 5;

  const checkAuth = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/check`, {
      credentials: 'include',
    });
    if (res.status !== 200) window.location.href = '/';
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployees(data);
    } catch {
      alert('Failed to fetch employees');
    }
  };

  useEffect(() => {
    checkAuth().then(fetchEmployees);
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone.includes(searchQuery) ||
    emp.empId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + recordsPerPage);

  const handleAddNew = () => {
    setEditEmployee(null);
    setShowForm(true);
  };

  const handleEdit = index => {
    setEditEmployee(currentEmployees[index]);
    setShowForm(true);
  };

  const handleDeleteSingle = index => {
    const emp = currentEmployees[index];
    setConfirmMessage(`Are you sure you want to delete ${emp.name}?`);
    setConfirmAction(() => async () => {
      await fetch(`${API_BASE_URL}/employees/${emp.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setEmployees(prev => prev.filter(e => e.id !== emp.id));
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;

    const selectedEmployees = employees.filter(emp => selectedRows.includes(emp.id));
    const message = selectedEmployees.length === 1
      ? `Are you sure you want to delete ${selectedEmployees[0].name}?`
      : `Are you sure you want to delete selected employees?`;

    setConfirmMessage(message);
    setConfirmAction(() => async () => {
      await Promise.all(
        selectedRows.map(id =>
          fetch(`${API_BASE_URL}/employees/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          })
        )
      );
      setEmployees(prev => prev.filter(e => !selectedRows.includes(e.id)));
      setSelectedRows([]);
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleRowClick = index => {
    setViewEmployee(currentEmployees[index]);
  };

  const handleSave = async (formData, isEdit) => {
    try {
      const endpoint = isEdit
        ? `${API_BASE_URL}/employees/${formData.get('id')}`
        : `${API_BASE_URL}/employees`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Save failed');
      }

      const saved = await res.json();

      if (isEdit) {
        setEmployees(prev =>
          prev.map(emp => (emp.id === saved.id ? saved : emp))
        );
      } else {
        setEmployees(prev => [...prev, saved]);
        setCurrentPage(Math.ceil((employees.length + 1) / recordsPerPage));
      }

      setShowForm(false);
    } catch (err) {
      console.error('Error saving employee:', err);
      alert(`Failed to save employee: ${err.message}`);
    }
  };

  const handleSingleMail = index => {
    const emp = currentEmployees[index];
    if (emp.email) {
      setMailRecipients([emp.email]);
      setShowMailModal(true);
    }
  };

  const handleBulkMail = () => {
    const emails = employees
      .filter(emp => selectedRows.includes(emp.id))
      .map(emp => emp.email);
    if (emails.length) {
      setMailRecipients(emails);
      setShowMailModal(true);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  return (
    <div className="app-container">
      <div className="layout">
        <Navbar
          onAdd={handleAddNew}
          onDelete={handleDeleteSelected}
          onMail={handleBulkMail}
          onLogout={handleLogout}
          isDeleteDisabled={selectedRows.length === 0}
          isMailDisabled={selectedRows.length === 0}
        />

        <div className="main-content">
          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />

          <EmployeeTable
            data={currentEmployees}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onEdit={handleEdit}
            onDeleteSingle={handleDeleteSingle}
            onMailSingle={handleSingleMail}
            onRowClick={handleRowClick}
          />

          <Footer
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalL={filteredEmployees.length}
            currentL={currentEmployees.length}
          />
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <AddEmployeeForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            editingData={editEmployee}
          />
        </div>
      )}

      {viewEmployee && (
        <EmployeeDetailsModal
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
        />
      )}

      {showConfirm && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showMailModal && (
        <Mail
          isOpen={true}
          onClose={() => setShowMailModal(false)}
          toEmails={mailRecipients}
          OnSend={() => setShowMailModal(false)}
        />
      )}
    </div>
  );
};

export default App;
