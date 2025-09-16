"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState("All");
    const router = useRouter();

    useEffect(() => {
        fetch("/api/issues")
            .then((res) => res.json())
            .then((data) => setIssues(data))
            .catch((err) => console.error("Error fetching issues:", err));
    }, []);

    const updateStatus = async (id, newStatus) => {
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
    };

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        router.push("/login");
    }

    const filteredIssues =
        filter === "All" ? issues : issues.filter((i) => i.status === filter);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <label className="mr-2 font-medium">Filter by Status:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-3">Title</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Change Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map((issue) => (
                            <tr key={issue._id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{issue.title}</td>
                                <td className="p-3">{issue.description}</td>
                                <td className="p-3">{issue.status}</td>
                                <td className="p-3">
                                    <select
                                        value={issue.status}
                                        onChange={(e) => updateStatus(issue._id, e.target.value)}
                                        className="px-2 py-1 border rounded-md"
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
                            <td colSpan="4" className="text-center p-4 text-gray-500">
                                No issues found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
