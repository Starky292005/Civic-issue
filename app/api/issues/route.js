import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { randomBytes } from "crypto";
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload stream to Cloudinary
function uploadStream(fileBuffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "civic-issues" }, // Optional: organize uploads in a folder
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        Readable.from(fileBuffer).pipe(stream);
    });
}

// Create new issue with optional image and location
export async function POST(req) {
    try {
        const formData = await req.formData();
        const title = formData.get("title");
        const description = formData.get("description");
        const category = formData.get("category");
        const image = formData.get("image");
        const latitude = formData.get("latitude");
        const longitude = formData.get("longitude");

        let imageUrl = null;
        if (image && image.size > 0) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result = await uploadStream(buffer);
            imageUrl = result.secure_url;
        }

        const client = await clientPromise;
        const db = client.db("civic-issues");

        const trackingId = randomBytes(4).toString("hex");

        const issueData = {
            title,
            description,
            category,
            trackingId,
            image: imageUrl,
            location: latitude && longitude ? { latitude, longitude } : null,
            status: "Open",
            createdAt: new Date(),
        };

        const result = await db.collection("issues").insertOne(issueData);

        return NextResponse.json(
            { _id: result.insertedId, trackingId, ...issueData },
            { status: 201 }
        );
    } catch (error) {
        console.error("API ERROR (POST):", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

// Get all issues
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