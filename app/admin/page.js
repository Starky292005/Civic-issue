// app/admin/page.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
    const cookieStore = cookies();
    const isAdminCookie = cookieStore.get("isAdmin");

    if (!isAdminCookie || isAdminCookie.value !== "true") {
        redirect("/login");
    }

    return <AdminDashboard />;
}
