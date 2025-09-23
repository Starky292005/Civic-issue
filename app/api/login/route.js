import { NextResponse } from "next/server";

export async function POST(req) {
    const { username, password } = await req.json();

    if (
        username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASS
    ) {
        const res = NextResponse.json({ success: true });

        // set cookie for the whole app
        res.cookies.set({
            name: "isAdmin",
            value: "true",
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            // Removed maxAge and expires to make it a session cookie
        });

        return res;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}