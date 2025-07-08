import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import EmployeeTable from './components/EmployeeTable';
import Footer from './components/Footer';
import AddEmployeeForm from './components/AddEmployeeForm';
import ConfirmDialog from './components/ConfirmDialog';
import Mail from './components/Mail';
import Searchbar from './components/Searchbar';
import './App.css';
import { API_BASE_URL } from './constants';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployees = () => {
    fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = '/';
          return;
        }
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setEmployees(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch employee data:", err);
        setIsLoading(false);
        showAlert("Failed to fetch employee data. Please try again.");
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [selectedRows, setSelectedRows] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => { });
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmMode, setConfirmMode] = useState('confirm');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailRecipients, setMailRecipients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(emp => {
    const query = searchQuery.toLowerCase();
    return (
      (emp.name ?? '').toLowerCase().includes(query) ||
      (emp.email ?? '').toLowerCase().includes(query) ||
      (emp.phone ?? '').toLowerCase().includes(query) ||
      (emp.empId ?? '').toString().toLowerCase().includes(query)
    );
  });


  const recordsPerPage = 5;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + recordsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDeleteSelected = () => {
    const pageSelected = selectedRows[currentPage] || [];
    if (pageSelected.length === 0) return;

    setConfirmMessage(pageSelected.length === 1
      ? `Are you sure you want to delete ${employees.find(e => e.id === pageSelected[0])?.name || "this employee"}?`
      : 'Are you sure you want to delete selected employees?'
    );

    setConfirmMode('confirm');
    setConfirmAction(() => () => {
      Promise.all(
        pageSelected.map(id =>
          fetch(`${API_BASE_URL}/employees/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          }).then(res => {
            if (res.status === 401) {
              window.location.href = '/';
              return;
            }
            if (!res.ok) throw new Error('Failed to delete employee');
            return res.json();
          })
        )
      )
        .then(() => {
          const updated = employees.filter(emp => !pageSelected.includes(emp.id));
          setEmployees(updated);
          setSelectedRows(prev => ({ ...prev, [currentPage]: [] }));
          setShowConfirm(false);
          adjustPageAfterDelete(updated);
        })
        .catch(err => {
          console.error("Failed to delete employees:", err);
          showAlert("Failed to delete selected employees. Please try again.");
        });
    });
    setShowConfirm(true);
  };

  const handleDeleteSingle = (index) => {
    const employee = employees[startIndex + index];
    setConfirmMessage(`Are you sure you want to delete ${employee?.name || "this employee"}?`);
    setConfirmMode('confirm');
    setConfirmAction(() => () => {
      fetch(`${API_BASE_URL}/employees/${employee.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
        .then(res => {
          if (res.status === 401) {
            window.location.href = '/';
            return;
          }
          if (!res.ok) throw new Error('Failed to delete employee');
          return res.json();
        })
        .then(() => {
          const updated = [...employees];
          updated.splice(startIndex + index, 1);
          setEmployees(updated);
          setShowConfirm(false);
          adjustPageAfterDelete(updated);
        })
        .catch(err => {
          console.error("Failed to delete employee:", err);
          showAlert("Failed to delete employee. Please try again.");
        });
    });
    setShowConfirm(true);
  };

  const adjustPageAfterDelete = (updatedList) => {
    const updatedTotalPages = Math.ceil(updatedList.length / recordsPerPage) || 1;
    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages);
    }
  };

  const handleAddNew = () => {
    setEditEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (index) => {
    setEditEmployee(employees[startIndex + index]);
    setShowForm(true);
  };

  const handleSave = (employee) => {
    const payload = {
      name: employee.name,
      email: employee.email,
      address: employee.address,
      phone: employee.phone,
      image: employee.image,
      empId: employee.empId,
      department: employee.department,
      position: employee.position,
      skills: employee.skills,
      gender: employee.gender,
      dob: employee.dob,
    };

    const requestMethod = employee.id ? 'PUT' : 'POST';
    const endpoint = employee.id
      ? `${API_BASE_URL}/employees/${employee.id}`
      : `${API_BASE_URL}/employees`;

    fetch(endpoint, {
      method: requestMethod,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = '/';
          return;
        }
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.message || 'Failed to save employee');
          });
        }
        return res.json();
      })
      .then(data => {
        if (employee.id) {
          const updated = employees.map(emp =>
            emp.id === data.id ? data : emp
          );
          setEmployees(updated);
        } else {
          setEmployees(prev => [...prev, data]);
          const updatedTotalPages = Math.ceil((employees.length + 1) / recordsPerPage);
          setCurrentPage(updatedTotalPages);
        }
        setShowForm(false);
      })
      .catch(err => {
        console.error("Failed to save employee:", err);
        showAlert(err.message || "Failed to save employee. Please try again.");
      });
  };

  const showAlert = (message) => {
    setConfirmMessage(message);
    setConfirmMode('alert');
    setConfirmAction(() => () => setShowConfirm(false));
    setShowConfirm(true);
  };

  const handleBulkMail = () => {
    const emails = (selectedRows[currentPage] || [])
      .map(id => employees.find(emp => emp.id === id)?.email)
      .filter(Boolean);

    if (emails.length > 0) {
      setMailRecipients(emails);
      setShowMailModal(true);
    }
  };

  const handleSingleMail = (index) => {
    const emp = employees[startIndex + index];
    if (emp?.email) {
      setMailRecipients([emp.email]);
      setShowMailModal(true);
    }
  };

  const handleMailSend = (data) => {
    if (data.type === 'error') {
      showAlert(data.message);
      return;
    }
    showAlert(data.message);
    setShowMailModal(false);
  };

  return (
    <div className="app-container">
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      ) : (
        <>
          <Navbar
            isDeleteDisabled={!selectedRows[currentPage] || selectedRows[currentPage].length === 0}
            isMailDisabled={!selectedRows[currentPage] || selectedRows[currentPage].length === 0}
            onDelete={handleDeleteSelected}
            onAdd={handleAddNew}
            onMail={handleBulkMail}
          />

          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />

          {currentEmployees.length > 0 ? (
            <EmployeeTable
              data={currentEmployees}
              selectedRows={selectedRows[currentPage] || []}
              setSelectedRows={rows =>
                setSelectedRows(prev => ({ ...prev, [currentPage]: rows }))
              }
              onEdit={handleEdit}
              onDeleteSingle={handleDeleteSingle}
              onMailSingle={handleSingleMail}
            />
          ) : (
            <div className="no-records">No records found.</div>
          )}

          {filteredEmployees.length > 0 && (
            <Footer
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalL={employees.length}
              currentL={currentEmployees.length}
            />
          )}

          <Mail
            isOpen={showMailModal}
            onClose={() => setShowMailModal(false)}
            toEmails={mailRecipients}
            OnSend={handleMailSend}
          />

          {showForm && (
            <div className="modal-overlay">
              <AddEmployeeForm
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
                editingData={editEmployee}
              />
            </div>
          )}

          {showConfirm && (
            <ConfirmDialog
              message={confirmMessage}
              onConfirm={confirmAction}
              onCancel={() => setShowConfirm(false)}
              mode={confirmMode}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
