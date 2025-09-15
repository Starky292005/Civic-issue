"use client";
import { useState } from "react";

export default function CitizenForm() {
    const [submitted, setSubmitted] = useState(false);
    const [trackingId, setTrackingId] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setTrackingId(data._id); // MongoDB auto-generates _id
                setSubmitted(true);
            } else {
                alert("Error submitting issue. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Server error. Please try again later.");
        }
    };

    if (submitted) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
                <h1 className="text-3xl font-bold mb-4">Issue Submitted ✅</h1>
                <p className="mb-4">Thank you for reporting the issue.</p>
                <p className="font-mono bg-gray-200 p-2 rounded">
                    Your Tracking ID: <span className="font-bold">{trackingId}</span>
                </p>
                <a
                    href="/"
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                    Back to Home
                </a>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>

                <label className="block mb-2 font-medium">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full mb-4 p-2 border rounded-lg"
                    placeholder="e.g. Broken streetlight"
                />

                <label className="block mb-2 font-medium">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full mb-4 p-2 border rounded-lg"
                    placeholder="Describe the issue in detail..."
                />

                <label className="block mb-2 font-medium">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full mb-6 p-2 border rounded-lg"
                >
                    <option value="">Select a category</option>
                    <option>Roads</option>
                    <option>Garbage</option>
                    <option>Water Supply</option>
                    <option>Electricity</option>
                    <option>Other</option>
                </select>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Submit Issue
                </button>
            </form>
        </main>
    );
}
