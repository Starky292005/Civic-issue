"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CitizenForm() {
    const [submitted, setSubmitted] = useState(false);
    const [trackingId, setTrackingId] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [location, setLocation] = useState(null); // State for location data
    const [mapLink, setMapLink] = useState(""); // State for the map link

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    setMapLink(`https://www.google.com/maps?q=${latitude},${longitude}`);
                },
                (error) => {
                    alert("Could not get location. Please enable location services.");
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const uploadFormData = new FormData();
        uploadFormData.append("title", formData.title);
        uploadFormData.append("description", formData.description);
        uploadFormData.append("category", formData.category);
        if (file) {
            uploadFormData.append("image", file);
        }
        if (location) {
            uploadFormData.append("latitude", location.latitude);
            uploadFormData.append("longitude", location.longitude);
        }

        try {
            const res = await fetch("/api/issues", {
                method: "POST",
                body: uploadFormData,
            });

            if (res.ok) {
                const data = await res.json();
                setTrackingId(data.trackingId);
                setSubmitted(true);
            } else {
                alert("Error submitting issue. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Server error. Please try again later.");
        } finally {
            setUploading(false);
        }
    };

    if (submitted) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 text-center p-4">
                <h1 className="text-3xl font-bold mb-4">Issue Submitted ✅</h1>
                <p className="mb-4">Thank you for reporting the issue.</p>
                <p className="font-mono bg-gray-200 p-2 rounded mb-6">
                    Your Tracking ID: <span className="font-bold text-lg">{trackingId}</span>
                </p>
                <p className="text-gray-600 mb-4">
                    Please save this ID to check the status of your report.
                </p>
                <button
                    onClick={() => router.push(`/track?id=${trackingId}`)}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    Track My Issue
                </button>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Report an Issue</h1>

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

                <label className="block mb-2 font-medium">Location</label>
                <div className="flex gap-2 mb-4">
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        className="flex-grow px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Get My Location
                    </button>
                    {mapLink && (
                        <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow text-center py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            View Map
                        </a>
                    )}
                </div>

                <label className="block mb-2 font-medium">Upload Photo (Optional)</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full mb-6 p-2 border rounded-lg"
                />

                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {uploading ? "Uploading..." : "Submit Issue"}
                </button>
            </form>
        </main>
    );
}