const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, role: {
        type: String,
        enum: ["need_help", "can_help", "both"],
        default: "both"
    },
    skills: [String],
    interests: [String],
    location: String,
    trustScore: { type: Number, default: 50 },
    totalHelpGiven: { type: Number, default: 0 },
    totalHelpReceived: { type: Number, default: 0 },
    badges: [String],
    isOnboarded: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
