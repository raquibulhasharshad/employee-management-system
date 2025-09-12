import React, { useEffect, useState } from "react";
import "./AdminAttendance.css";
import { API_BASE_URL } from "../constants";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Searchbar from "./Searchbar";
import AdminAttendanceModal from "./AdminAttendanceModal";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dateFilter, setDateFilter] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const recordsPerPage = 5;
  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    if (dateFilter) fetchAttendance(dateFilter);
  }, [dateFilter]);

  const fetchAttendance = async (date) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/date/${date}`, {
        credentials: "include",
      });
      const data = await res.json();
      setAttendance(data);
      applyFilters(data, statusFilter, searchQuery);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const openAttendanceForDate = async () => {
    if (dateFilter < today) {
      alert("Cannot open attendance for previous dates.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/open`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date: dateFilter }),
      });
      const data = await res.json();
      if (data.success) fetchAttendance(dateFilter);
      else alert(data.message);
    } catch (err) {
      console.error("Error opening attendance:", err);
    }
  };

  const getImageUrl = (img) => {
    if (img) {
      return img.startsWith("/uploads")
        ? `${API_BASE_URL.replace("/api", "")}${img}`
        : img;
    }
    return "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";
  };

  const applyFilters = (
    list = attendance,
    status = statusFilter,
    query = searchQuery
  ) => {
    let result = [...list];
    if (status !== "all") {
      result = result.filter((rec) => rec.status === status);
    }
    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        (rec) =>
          rec.employee?.name?.toLowerCase().includes(lower) ||
          rec.employee?.empId?.toLowerCase().includes(lower) ||
          rec.employee?.department?.toLowerCase().includes(lower)
      );
    }
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(attendance, statusFilter, query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    applyFilters(attendance, statusFilter, "");
  };

  useEffect(() => {
    applyFilters(attendance, statusFilter, searchQuery);
  }, [attendance, statusFilter]);

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filtered.slice(indexOfFirst, indexOfLast);

  const getStatusClass = (status) => {
    if (status === "Present") return "status-present";
    if (status === "Absent") return "status-absent";
    if (status === "Half-day") return "status-half-day";
    return "";
  };

  return (
    <>
      <Navbar onAttendanceOpened={openAttendanceForDate} />
      <div className="admin-attendance-page">
        <div className="filters-container">
          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search by Name, ID, Dept"
          />

          <div className="filters">
            <label>
              Date:
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </label>

            <label>
              Status:
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half-day">Half-day</option>
              </select>
            </label>
          </div>
        </div>

        {/* --- Swipeable wrapper --- */}
        <div className="table-wrapper">
          <table className="admin-attendance-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Department</th>
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
                    className="clickable-row"
                  >
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      <img
                        src={getImageUrl(rec.employee?.image)}
                        alt={rec.employee?.name}
                        className="admin-attendance-img"
                      />
                    </td>
                    <td>{rec.employee?.empId}</td>
                    <td>{rec.employee?.name}</td>
                    <td>{rec.employee?.department}</td>
                    <td>{rec.checkIn || "-"}</td>
                    <td>{rec.checkOut || "-"}</td>
                    <td className={getStatusClass(rec.status)}>{rec.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
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
            footerClass="admin-attendance-footer"
          />
        )}

        {selectedRecord && (
          <AdminAttendanceModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onUpdated={() => fetchAttendance(dateFilter)}
          />
        )}
      </div>
    </>
  );
};

export default AdminAttendance;
