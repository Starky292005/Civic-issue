"use client";
import { useEffect, useState } from "react";

export default function IssuesPage() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchIssues() {
            try {
                const res = await fetch("/api/issues");
                const data = await res.json();
                setIssues(data);
            } catch (err) {
                console.error("Error fetching issues:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchIssues();
    }, []);

    if (loading) return <p className="p-4">Loading issues...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reported Issues</h1>
            {issues.length === 0 ? (
                <p>No issues reported yet.</p>
            ) : (
                <ul className="space-y-4">
                    {issues.map((issue) => (
                        <li key={issue._id} className="border p-4 rounded-md shadow-sm">
                            <h2 className="text-lg font-semibold">{issue.title}</h2>
                            <p className="text-gray-700">{issue.description}</p>
                            <p className="text-sm text-gray-500">
                                Status: {issue.status} |{" "}
                                {new Date(issue.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
