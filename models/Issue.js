import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    status: { type: String, default: "Open" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
