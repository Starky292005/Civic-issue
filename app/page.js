export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-900">
        <h1 className="text-4xl font-bold mb-8">Civic Issue Tracker</h1>
        <div className="flex gap-6">
          <a
              href="/citizen"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            Report an Issue
          </a>
          <a
              href="/admin"
              className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          >
            Admin Dashboard
          </a>
        </div>
      </main>
  );
}
