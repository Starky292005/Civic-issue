import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-900">
            <h1 className="text-4xl font-bold mb-8">Civic Issue Tracker</h1>
            <div className="flex gap-6">
                <Link
                    href="/citizen"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-colors"
                >
                    Report an Issue
                </Link>
                <Link
                    href="/admin"
                    className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition-colors"
                >
                    Admin Dashboard
                </Link>
                <Link
                    href="/track"
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl shadow hover:bg-gray-700 transition-colors"
                >
                    Track My Issue
                </Link>
            </div>
        </main>
    );
}