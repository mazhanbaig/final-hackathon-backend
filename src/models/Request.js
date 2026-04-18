const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium"
    },
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["open", "in-progress", "resolved"],
        default: "open"
    },
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    aiSuggestions: {
        suggestedCategory: String,
        suggestedTags: [String],
        urgencyScore: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);