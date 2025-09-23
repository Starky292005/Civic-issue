"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard({ initialIssues, isAdmin }) {
    const [issues, setIssues] = useState(initialIssues);
    const [filter, setFilter] = useState("All");
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push("/login");
        }
    }, [isAdmin, router]);

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        router.push("/login");
    }

    const updateStatus = async (id, newStatus) => {
        await fetch(`/api/issues/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        setIssues(
            issues.map((issue) =>
                issue._id === id ? { ...issue, status: newStatus } : issue
            )
        );
    };

    const filteredIssues =
        filter === "All" ? issues : issues.filter((i) => i.status === filter);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Resolved":
                return "bg-green-100 text-green-800";
            case "In Progress":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    if (!isAdmin) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
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
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-3">Title</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Image</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Change Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map((issue) => (
                            <tr key={issue._id} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-medium">{issue.title}</td>
                                <td className="p-3 text-sm text-gray-600">{issue.description}</td>
                                <td className="p-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(issue.status)}`}>
                      {issue.status}
                    </span>
                                </td>
                                <td className="p-3">
                                    {issue.image ? (
                                        <a href={issue.image} target="_blank" rel="noopener noreferrer">
                                            <img src={issue.image} alt="Issue photo" className="h-12 w-12 object-cover rounded" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 text-sm">No image</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {issue.location ? (
                                        <a href={`http://www.google.com/maps/place/${issue.location.latitude},${issue.location.longitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            View Map
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 text-sm">No location</span>
                                    )}
                                </td>
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
                            <td colSpan="6" className="text-center p-4 text-gray-500">
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