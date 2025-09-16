import connectDB from "@/lib/mongodb";
import Issue from "@/models/Issue";
import { NextResponse } from "next/server";

// Update issue by ID
export async function PUT(req, { params }) {
    await connectDB();
    const { id } = params;
    const { status } = await req.json();

    try {
        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        return NextResponse.json(updatedIssue);
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to update issue" },
            { status: 500 }
        );
    }
}
