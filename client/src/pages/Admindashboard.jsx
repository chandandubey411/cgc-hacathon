import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];
const CATEGORIES = ["Garbage", "Water Leak", "Road Safety", "Pothole", "Streetlight", "Other"];
const SORT_OPTIONS = [
  { label: "Latest first", value: "latest" },
  { label: "Oldest first", value: "oldest" },
];

const AdminDashboard = () => {
  const [allIssues, setAllIssues] = useState([]); // original data
  const [issues, setIssues] = useState([]); // filtered data
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
    sort: "latest",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("loggedInUser");
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/api/issues", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAllIssues(data);
    setIssues(data);
    setLoading(false);
  };

  useEffect(() => {
    applyFrontendFilters();
    // eslint-disable-next-line
  }, [filters, allIssues]);

  const applyFrontendFilters = () => {
    let filtered = [...allIssues];

    // status
    if (filters.status)
      filtered = filtered.filter((i) => i.status === filters.status);

    // category
    if (filters.category)
      filtered = filtered.filter((i) => i.category === filters.category);

    // search by title
    if (filters.search)
      filtered = filtered.filter((i) =>
        i.title.toLowerCase().includes(filters.search.toLowerCase())
      );

    // sort
    filtered.sort((a, b) =>
      filters.sort === "latest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    setIssues(filtered);
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const startEdit = (issue) => {
    setEditing(issue._id);
    setResolutionNotes(issue.resolutionNotes || "");
    setStatus(issue.status);
    setAssignedTo(issue.assignedTo?._id || "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setResolutionNotes("");
    setStatus("");
    setAssignedTo("");
  };

  const saveChanges = async (id) => {
    const res = await fetch(`http://localhost:8080/api/issues/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, resolutionNotes, assignedTo }),
    });
    if (res.ok) {
      fetchData();
      cancelEdit();
    } else alert("Update failed");
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    const res = await fetch(`http://localhost:8080/api/issues/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setAllIssues(allIssues.filter((i) => i._id !== id));
    else alert("Delete failed");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading issues...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {name || "-"} ({email})</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilter}
          className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilter}
          className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilter}
          className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          name="search"
          type="text"
          placeholder="Search by title..."
          value={filters.search}
          onChange={handleFilter}
          className="border rounded-lg px-3 py-2 flex-1 min-w-[200px] shadow-sm focus:ring focus:ring-blue-300"
        />

        <button
          onClick={() =>
            setFilters({ status: "", category: "", search: "", sort: "latest" })
          }
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Resolution</th>
              <th className="px-4 py-2">Assigned To</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{issue.title}</td>
                <td className="px-4 py-2">{issue.category}</td>
                <td className="px-4 py-2">
                  {editing === issue._id ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="border rounded p-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={
                        issue.status === "Resolved"
                          ? "text-green-600 font-semibold"
                          : issue.status === "In Progress"
                          ? "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {issue.status}
                    </span>
                  )}
                </td>

                <td className="px-4 py-2">
                  {editing === issue._id ? (
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="border rounded w-full p-1 text-sm"
                      rows={2}
                    />
                  ) : (
                    issue.resolutionNotes || "-"
                  )}
                </td>

                <td className="px-4 py-2 text-sm">
                  {editing === issue._id ? (
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="">Unassigned</option>
                      {staffList.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    issue.assignedTo?.name || "Unassigned"
                  )}
                </td>

                <td className="px-4 py-2 space-x-2">
                  {editing === issue._id ? (
                    <>
                      <button
                        onClick={() => saveChanges(issue._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 hover:bg-gray-600 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(issue)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteIssue(issue._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {issues.length === 0 && (
          <p className="text-center text-gray-500 py-6">No issues found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
