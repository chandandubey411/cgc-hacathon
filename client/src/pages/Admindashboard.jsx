import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const name = localStorage.getItem("loggedInUser");
  const email = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/api/issues", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setIssues(await res.json());
    setLoading(false);
  };

  const startEdit = (issue) => {
    setEditing(issue._id);
    setResolutionNotes(issue.resolutionNotes || "");
    setStatus(issue.status);
  };

  const cancelEdit = () => {
    setEditing(null);
    setResolutionNotes("");
    setStatus("");
  };

  const saveChanges = async (id) => {
    const res = await fetch(`http://localhost:8080/api/issues/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, resolutionNotes }),
    });
    if (res.ok) {
      fetchIssues();
      cancelEdit();
    } else alert("Update failed");
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    const res = await fetch(`http://localhost:8080/api/issues/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setIssues(issues.filter((i) => i._id !== id));
    else alert("Delete failed");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading issues...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-6 flex justify-center">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl">
        {/* LEFT: Admin Profile */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-bold mb-4 shadow-md">
              {name ? name[0].toUpperCase() : "A"}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {name || "Admin User"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {email || "admin@email.com"}
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white font-medium shadow-md transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* RIGHT: Issue Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🧾 Reported Issues
            </h2>
            <span className="text-sm text-gray-500">
              Total: {issues.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-blue-100 text-blue-800 uppercase text-xs tracking-wider rounded-md">
                  <th className="px-4 py-3 text-left rounded-l-lg">Title</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Resolution</th>
                  <th className="px-4 py-3 text-left">Reporter</th>
                  <th className="px-4 py-3 text-center rounded-r-lg">Actions</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="bg-gray-50 hover:bg-gray-100 transition-all shadow-sm rounded-lg"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {issue.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {issue.description}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {issue.category}
                    </td>
                    <td className="px-4 py-3">
                      {issue.imageURL && (
                        <img
                          src={
                            issue.imageURL.startsWith("http")
                              ? issue.imageURL
                              : `http://localhost:8080/${issue.imageURL.replace(
                                  /\\/g,
                                  "/"
                                )}`
                          }
                          alt={issue.title}
                          className="h-16 w-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {editing === issue._id ? (
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="border rounded-lg px-2 py-1 bg-white text-gray-800 shadow-sm"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`font-semibold px-3 py-1 rounded-full text-xs ${
                            issue.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : issue.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {issue.status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 w-56">
                      {editing === issue._id ? (
                        <textarea
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          className="border rounded-lg w-full p-2 text-sm bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-200"
                          rows={2}
                        />
                      ) : (
                        <span className="text-gray-700 text-xs italic">
                          {issue.resolutionNotes || "No notes added"}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="font-medium">{issue.createdBy?.name}</div>
                      <div className="text-gray-400">
                        {issue.createdBy?.email}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {editing === issue._id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => saveChanges(issue._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition"
                          >
                            💾 Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition"
                          >
                            ✖ Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => startEdit(issue)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteIssue(issue._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {issues.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No issues found yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
