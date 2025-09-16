"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState("All");
    const router = useRouter();

    // Fetch issues
    useEffect(() => {
        fetch("/api/issues")
            .then((res) => res.json())
            .then((data) => setIssues(data))
            .catch((err) => console.error("Error fetching issues:", err));
    }, []);

    // Update issue status
    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`/api/issues/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            setIssues((prev) =>
                prev.map((issue) =>
                    issue._id === id ? { ...issue, status: newStatus } : issue
                )
            );
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    // Logout
    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        router.push("/login");
    }

    // Filter issues
    const filteredIssues =
        filter === "All"
            ? issues
            : issues.filter((issue) => issue.status === filter);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
                Logout
            </button>

            {/* Filter Dropdown */}
            <label>Filter by Status: </label>
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ marginBottom: "20px" }}
            >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select>

            {/* Issues Table */}
            <table border="1" cellPadding="10" style={{ width: "100%" }}>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Change Status</th>
                </tr>
                </thead>
                <tbody>
                {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                        <tr key={issue._id}>
                            <td>{issue.title}</td>
                            <td>{issue.description}</td>
                            <td>{issue.status}</td>
                            <td>
                                <select
                                    value={issue.status}
                                    onChange={(e) => updateStatus(issue._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No issues found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
