import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("civic-issues");
        const { id } = params;
        const { status } = await req.json();

        const result = await db.collection("issues").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Status updated successfully" });
    } catch (error) {
        console.error("PUT API ERROR:", error);
        return NextResponse.json(
            { error: "Failed to update issue" },
            { status: 500 }
        );
    }
}