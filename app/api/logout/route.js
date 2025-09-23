import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("isAdmin", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0, // Immediately expires the cookie
    });
    return response;
}