import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
    const cookieStore = cookies();
    const isAdminCookie = cookieStore.get("isAdmin");

    const isAdmin = isAdminCookie?.value === "true";

    if (!isAdmin) {
        redirect("/login");
    }

    const issuesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/issues`, {
        cache: "no-store",
        headers: {
            "Cookie": `isAdmin=${isAdminCookie.value}`
        }
    });

    if (!issuesRes.ok) {
        throw new Error("Failed to fetch issues");
    }

    const issuesData = await issuesRes.json();

    return <AdminDashboard initialIssues={issuesData} isAdmin={isAdmin} />;
}