import React, { useEffect, useState } from 'react';
import './Salary.css';
import { API_BASE_URL } from '../constants';
import Navbar from './EmployeeNavbar';
import Footer from './Footer';
import EmployeeSalaryDetailsModal from './EmployeeSalaryDetailsModal';

const EmployeeSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const fetchMySalaries = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary/my-salaries`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setSalaries(data.salaries);
        setFiltered(data.salaries);

        const uniqueYears = [...new Set(data.salaries.map(s => s.month.split('-')[1]))];
        setYears(uniqueYears.sort((a, b) => b - a));
      }
    } catch (err) {
      console.error('Error fetching employee salaries', err);
    }
  };

  useEffect(() => { fetchMySalaries(); }, []);

  const applyFilters = (list, year, month) => {
    let result = [...list];
    if (year !== 'all') result = result.filter(s => s.month.split('-')[1] === year);
    if (month !== 'all') result = result.filter(s => s.month.split('-')[0] === month);
    setFiltered(result);
    setCurrentPage(1); // reset to first page when filters change
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedMonth('all');
    const monthsForYear = salaries
      .filter(s => s.month.split('-')[1] === year)
      .map(s => s.month.split('-')[0]);
    setMonths([...new Set(monthsForYear)]);
    applyFilters(salaries, year, 'all');
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    applyFilters(salaries, selectedYear, month);
  };

  // pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="employee-salary-page">
      <h2>My Salary</h2>
      <Navbar isDeleteDisabled isMailDisabled />

      <div className="salary-header employee-filters">
        <div className="filter-dropdown-year-employee">
          <label>Year:</label>
          <select value={selectedYear} onChange={e => handleYearChange(e.target.value)}>
            <option value="all">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="filter-dropdown-month-employee">
          <label>Month:</label>
          <select value={selectedMonth} onChange={e => handleMonthChange(e.target.value)}>
            <option value="all">All Months</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Basic</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(s => (
            <tr key={s._id} onClick={() => setSelectedSalary(s)} className="clickable-row">
              <td>{s.month}</td>
              <td>{s.basicSalary}</td>
              <td>{s.bonus}</td>
              <td>{s.deductions}</td>
              <td>{s.netSalary}</td>
              <td className={s.status === 'Paid' ? 'paid' : 'unpaid'}>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length > 0 && (
        <Footer
          currentPage={currentPage}
          totalPages={Math.ceil(filtered.length / itemsPerPage)}
          setCurrentPage={setCurrentPage}
          totalL={filtered.length}
          currentL={currentItems.length}
        />
      )}

      {selectedSalary && (
        <EmployeeSalaryDetailsModal
          salary={selectedSalary}
          onClose={() => setSelectedSalary(null)}
        />
      )}
    </div>
  );
};

export default EmployeeSalary;
