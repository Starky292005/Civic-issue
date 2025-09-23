import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
    try {
        const { trackingId } = params;
        const client = await clientPromise;
        const db = client.db("civic-issues");

        const issue = await db.collection("issues").findOne({ trackingId });

        if (!issue) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        }

        return NextResponse.json(issue, { status: 200 });
    } catch (err) {
        console.error("TRACK API ERROR:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
