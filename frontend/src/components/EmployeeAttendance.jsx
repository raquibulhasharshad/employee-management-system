import React, { useEffect, useState } from "react";
import "./EmployeeAttendance.css";
import { API_BASE_URL } from "../constants";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeAttendanceModal from "./EmployeeAttendanceModal";
import Footer from "./Footer";

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const currentDate = new Date();
  const defaultMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const defaultYear = currentDate.getFullYear().toString();

  const [monthFilter, setMonthFilter] = useState(defaultMonth);
  const [yearFilter, setYearFilter] = useState(defaultYear);

  const recordsPerPage = 5;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/my`, { credentials: "include" });
      const data = await res.json();

      const today = new Date().toLocaleDateString("en-CA");
      const filteredData = data.filter((rec) => rec.date <= today);
      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

      setAttendance(filteredData);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/check-in`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) fetchAttendance();
      else alert(data.message);
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Something went wrong during check-in.");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/check-out`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) fetchAttendance();
      else alert(data.message);
    } catch (err) {
      console.error("Check-out error:", err);
      alert("Something went wrong during check-out.");
    }
  };

  const today = new Date().toLocaleDateString("en-CA");
  const todayRecord = attendance.find((rec) => rec.date === today);

  const filteredAttendance = attendance.filter((rec) => {
    const recDate = new Date(rec.date);
    const recMonth = (recDate.getMonth() + 1).toString().padStart(2, "0");
    const recYear = recDate.getFullYear().toString();

    return (
      (monthFilter !== "all" ? recMonth === monthFilter : true) &&
      (yearFilter !== "all" ? recYear === yearFilter : true)
    );
  });

  const totalRecords = filteredAttendance.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredAttendance.slice(indexOfFirst, indexOfLast);

  const availableYears = [...new Set(attendance.map((rec) => new Date(rec.date).getFullYear()))];

  return (
    <>
      <EmployeeNavbar
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        todayRecord={todayRecord}
      />

      <div className="employee-attendance-page">
        <h2 className="heading">My Attendance</h2>

        {/* Filters */}
        <div className="attendance-filters">
          <label>
            Month:
            <select
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, "0");
                return (
                  <option key={month} value={month}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            Year:
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrapper">
          <table className="employee-attendance-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((rec, index) => (
                  <tr
                    key={rec._id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`clickable-row ${rec.date === today ? "today-record" : ""}`}
                  >
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{rec.date}</td>
                    <td>{rec.checkIn || "-"}</td>
                    <td>{rec.checkOut || "-"}</td>
                    <td>{rec.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalRecords > 0 && (
          <Footer
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalL={totalRecords}
            currentL={currentRecords.length}
            footerClass="employee-attendance-footer"
          />
        )}

        {selectedRecord && (
          <EmployeeAttendanceModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onUpdated={fetchAttendance}
          />
        )}
      </div>
    </>
  );
};

export default EmployeeAttendance;
