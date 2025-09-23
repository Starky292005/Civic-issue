"use client";
import { useState } from "react";

export default function TrackPage() {
    const [trackingId, setTrackingId] = useState("");
    const [issue, setIssue] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSearch() {
        setError("");
        setIssue(null);
        setLoading(true);

        try {
            const res = await fetch(`/api/issues/track/${trackingId}`);
            const data = await res.json();
            if (!res.ok) {
                setError("Issue not found. Please check your Tracking ID.");
                return;
            }
            setIssue(data);
        } catch (err) {
            console.error("Error fetching issue:", err);
            setError("Something went wrong. Try again later.");
        } finally {
            setLoading(false);
        }
    }

    const getProgressBarColor = (status) => {
        switch (status) {
            case "Resolved":
                return "bg-green-500";
            case "In Progress":
                return "bg-blue-500";
            default:
                return "bg-yellow-500";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Track Your Issue</h1>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter Tracking ID"
                        className="flex-grow p-2 border rounded-md"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-red-500">{error}</p>
                )}

                {issue && (
                    <div className="mt-6 border p-4 rounded-md shadow-sm">
                        <h2 className="text-xl font-bold mb-2">Issue Details</h2>
                        <div className="mb-4">
                            <p className="font-semibold">Status: <span className="font-normal">{issue.status}</span></p>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative pt-1 mb-4">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getProgressBarColor(issue.status)} text-white`}>
                                        {issue.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-gray-600">
                                        {issue.status === "Pending" ? "0%" : issue.status === "In Progress" ? "50%" : "100%"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-2 overflow-hidden text-xs rounded bg-gray-200">
                                <div style={{ width: issue.status === "Resolved" ? "100%" : issue.status === "In Progress" ? "50%" : "0%" }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressBarColor(issue.status)}`}></div>
                            </div>
                        </div>

                        <p className="text-gray-700"><strong>Title:</strong> {issue.title}</p>
                        <p className="text-gray-700"><strong>Description:</strong> {issue.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Reported on: {new Date(issue.createdAt).toLocaleString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}