// app/api/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ success: true });

    res.cookies.set({
        name: "isAdmin",
        value: "",           // clear value
        path: "/",           // IMPORTANT: same path used when setting
        httpOnly: true,
        maxAge: 0,           // expire immediately
    });

    return res;
}
