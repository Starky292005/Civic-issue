import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Utility: generate a short tracking ID
function generateTrackingId() {
    return "TID-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function POST(req) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("civic-issues");

        const trackingId = generateTrackingId();

        const issueData = {
            ...body,
            status: "Open",
            trackingId,       // ✅ store tracking ID
            createdAt: new Date(),
        };

        const result = await db.collection("issues").insertOne(issueData);

        return NextResponse.json(
            { ...issueData, _id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("civic-issues");
        const collection = db.collection("issues");

        const issues = await collection.find().sort({ createdAt: -1 }).toArray();

        return NextResponse.json(issues, { status: 200 });
    } catch (err) {
        console.error("API ERROR (GET):", err);
        return NextResponse.json({ error: "Error fetching issues" }, { status: 500 });
    }
}
