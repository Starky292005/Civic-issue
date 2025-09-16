import { NextResponse } from "next/server";

export async function POST(req) {
    const { username, password } = await req.json();

    if (
        username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASS
    ) {
        // ✅ Set a simple cookie
        const res = NextResponse.json({ success: true });
        res.cookies.set("isAdmin", "true", { httpOnly: true });
        return res;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
