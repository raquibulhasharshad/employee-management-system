import React, { useEffect, useState } from 'react';
import './Salary.css';
import { API_BASE_URL } from '../constants';
import Navbar from './Navbar';
import Searchbar from './Searchbar';
import Footer from './Footer';
import SalaryFormModal from './SalaryFormModal';
import SalaryDetailsModal from './SalaryDetailsModal';

const AdminSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultAvatar =
    'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setSalaries(data.salaries);
        setFiltered(data.salaries);

        const uniqueYears = [...new Set(data.salaries.map(s => s.month.split('-')[1]))];
        setYears(uniqueYears.sort((a, b) => b - a));
      }
    } catch (err) {
      console.error('Error fetching salaries', err);
    }
  };

  // Unified filter function for search + year + month
  const applyFilters = (list, year, month, query) => {
    let result = [...list];

    if (year !== 'all') result = result.filter(s => s.month.split('-')[1] === year);
    if (month !== 'all') result = result.filter(s => s.month.split('-')[0] === month);

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        s =>
          s.employee?.name.toLowerCase().includes(q) ||
          s.employee?.empId.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(salaries, selectedYear, selectedMonth, query);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedMonth('all');
    const monthsForYear = salaries
      .filter(s => s.month.split('-')[1] === year)
      .map(s => s.month.split('-')[0]);
    setMonths([...new Set(monthsForYear)]);
    applyFilters(salaries, year, 'all', searchQuery);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    applyFilters(salaries, selectedYear, month, searchQuery);
  };

  const handleStatusUpdate = async (salaryId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary/${salaryId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchSalaries();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getImageUrl = (img) => {
    if (img) return img.startsWith('/uploads') ? `${API_BASE_URL.replace('/api', '')}${img}` : img;
    return defaultAvatar;
  };

  return (
    <div className="admin-salary-page">
      <Navbar onAdd={() => setShowForm(true)} isDeleteDisabled isMailDisabled />

      <div className="salary-header">
        <Searchbar
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          onClear={() => handleSearch('')}
        />

        <div className="filter-dropdown-year-admin">
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => handleYearChange(e.target.value)}>
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-dropdown-month-admin">
          <label>Month:</label>
          <select value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)}>
            <option value="all">All Months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Basic</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Net</th>
            <th>Month</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s._id} onClick={() => setSelectedSalary(s)}>
              <td>
                <img src={getImageUrl(s.employee?.image)} alt="Employee" className="salary-photo" />
              </td>
              <td>{s.employee?.empId}</td>
              <td>{s.employee?.name}</td>
              <td>{s.employee?.department}</td>
              <td>{s.basicSalary}</td>
              <td>{s.bonus}</td>
              <td>{s.deductions}</td>
              <td>{s.netSalary}</td>
              <td>{s.month}</td>
              <td
                className={s.status === 'Paid' ? 'paid' : 'unpaid'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(s._id, s.status === 'Paid' ? 'Unpaid' : 'Paid');
                }}
              >
                {s.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Footer
        totalPages={1}
        currentPage={1}
        setCurrentPage={() => {}}
        totalL={filtered.length}
        currentL={filtered.length}
      />

      {showForm && <SalaryFormModal onClose={() => setShowForm(false)} onSuccess={fetchSalaries} />}
      {selectedSalary && (
        <SalaryDetailsModal
          salary={selectedSalary}
          onClose={() => setSelectedSalary(null)}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default AdminSalary;
