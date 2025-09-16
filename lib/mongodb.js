// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    // In dev, use a global variable so it's not constantly re-created on hot reloads
    if (!global._mongoClient) {
        client = new MongoClient(uri, { tls: true });
        global._mongoClient = client.connect();
    }
    clientPromise = global._mongoClient;
} else {
    // In production, just create a new client
    client = new MongoClient(uri, { tls: true });
    clientPromise = client.connect();
}

export default clientPromise;
