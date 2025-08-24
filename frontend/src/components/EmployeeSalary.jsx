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

  const fetchMySalaries = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary/my-salaries`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setSalaries(data.salaries);
        setFiltered(data.salaries);

        const uniqueYears = [...new Set(data.salaries.map(s => s.month.split('-')[1]))];
        setYears(uniqueYears.sort((a,b) => b - a));
      }
    } catch (err) {
      console.error('Error fetching employee salaries', err);
    }
  };

  useEffect(()=>{ fetchMySalaries(); }, []);

  const handleFilter = () => {
    let result = [...salaries];
    if(selectedYear!=='all') result = result.filter(s=>s.month.split('-')[1]===selectedYear);
    if(selectedMonth!=='all') result = result.filter(s=>s.month.split('-')[0]===selectedMonth);
    setFiltered(result);
  };

  const handleYearChange = (year)=>{
    setSelectedYear(year);
    setSelectedMonth('all');
    const monthsForYear = salaries.filter(s=>s.month.split('-')[1]===year).map(s=>s.month.split('-')[0]);
    setMonths([...new Set(monthsForYear)]);
    handleFilter();
  };

  const handleMonthChange = (month)=>{
    setSelectedMonth(month);
    handleFilter();
  };

  return (
    <div className="employee-salary-page">
      <h2>My Salary</h2>
      <Navbar isDeleteDisabled isMailDisabled />

      <div className="salary-header employee-filters">
        <div className="filter-dropdown-year-employee">
          <label>Year:</label>
          <select value={selectedYear} onChange={e=>handleYearChange(e.target.value)}>
            <option value="all">All Years</option>
            {years.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="filter-dropdown-month-employee">
          <label>Month:</label>
          <select value={selectedMonth} onChange={e=>handleMonthChange(e.target.value)}>
            <option value="all">All Months</option>
            {months.map(m=><option key={m} value={m}>{m}</option>)}
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
          {filtered.map(s=>(
            <tr key={s._id} onClick={()=>setSelectedSalary(s)} className="clickable-row">
              <td>{s.month}</td>
              <td>{s.basicSalary}</td>
              <td>{s.bonus}</td>
              <td>{s.deductions}</td>
              <td>{s.netSalary}</td>
              <td className={s.status==='Paid'?'paid':'unpaid'}>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Footer totalPages={1} currentPage={1} setCurrentPage={()=>{}} totalL={filtered.length} currentL={filtered.length} />

      {selectedSalary && <EmployeeSalaryDetailsModal salary={selectedSalary} onClose={()=>setSelectedSalary(null)} />}
    </div>
  );
};

export default EmployeeSalary;
