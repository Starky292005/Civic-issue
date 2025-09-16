import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.set("isAdmin", "", { httpOnly: true, maxAge: 0 }); // clear cookie
    return res;
}
