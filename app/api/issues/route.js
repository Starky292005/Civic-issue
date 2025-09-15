import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("civic-issues");

        const result = await db.collection("issues").insertOne({
            ...body,
            status: "Open",
            createdAt: new Date(),
        });

        return NextResponse.json(result.ops ? result.ops[0] : { _id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("civic-issues"); // <-- same DB name
        const collection = db.collection("issues");

        const issues = await collection.find().sort({ createdAt: -1 }).toArray();

        return new Response(JSON.stringify(issues), { status: 200 });
    } catch (err) {
        console.error("API ERROR (GET):", err);
        return new Response("Error fetching issues", { status: 500 });
    }
}
